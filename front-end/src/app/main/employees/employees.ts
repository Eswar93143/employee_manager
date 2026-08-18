import { TableModule } from 'primeng/table';
import { ViewEncapsulation } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router
} from '@angular/router';

import {
  BehaviorSubject,
  Subject,
  combineLatest,
  filter,
  map,
  takeUntil
} from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';

import { Employee } from './models/employee.interface';
import { EmployeeService } from './employee-services/Employee.service';
import { SharedService } from '../services/shared.service';
import {
  AfterViewInit,
  ViewChild
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';

interface EmployeeTableRow extends Employee {
  departmentName: string;
  roleName: string;
}
@Component({
  selector: 'app-employees',
  imports: [TableModule, RouterOutlet],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator)
paginator!: MatPaginator;

  view = 'list';

  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'department',
    'role',
    'status',
    'actions'
  ];

  dataSource =
    new MatTableDataSource<EmployeeTableRow>([]);

  searchTerm = '';

  private destroy$ = new Subject<void>();

  allTableRows: EmployeeTableRow[] = [];

  constructor(
    private employeeService: EmployeeService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.listenToRoute();

    this.loadEmployees();

    this.listenToEmployeeAndMasterData();
  }

  ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
}

  /**
 * Detect current child route view.
 */
  private listenToRoute(): void {

    this.updateView();

    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateView();
      });
  }

  private updateView(): void {

    const childRoute =
      this.activatedRoute.firstChild;

    this.view =
      childRoute?.snapshot.data?.['view']
      ?? this.activatedRoute.snapshot.data?.['view']
      ?? 'list';
  }

  /**
   * Fetch employees only if service
   * doesn't already contain employees.
   */
  private loadEmployees(): void {

    if (this.employeeService.hasEmployeesLoaded()) {
      return;
    }

    this.employeeService
      .fetchEmployees()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Whenever employees OR departments OR roles
   * change, rebuild the table.
   */
 private listenToEmployeeAndMasterData(): void {

  combineLatest([
    this.employeeService.employees$,
    this.sharedService.departments$,
    this.sharedService.roles$
  ])
    .pipe(
      map(([employees, departments, roles]) => {

        return employees.map(employee => {

          const department =
            departments.find(
              item => item.id === employee.department
            );

          const role =
            roles.find(
              item => item.id === employee.role
            );

          return {
            ...employee,

            departmentName:
              department?.name ??
              employee.department ??
              '-',

            roleName:
              role?.name ??
              employee.role ??
              '-'
          };
        });
      }),
      takeUntil(this.destroy$)
    )
    .subscribe(rows => {

      this.allTableRows = rows;

      this.applySearch();
    });
}

  /**
  * Temporary client-side search.
  *
  * Does NOT modify EmployeeService.
  */
  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm =
      input.value.trim().toLowerCase();

    this.applySearch();
  }

private applySearch(): void {

  const search =
    this.searchTerm.trim().toLowerCase();

  if (!search) {
    this.dataSource.data = this.allTableRows;
    return;
  }

  this.dataSource.data =
    this.allTableRows.filter(employee => {

      const searchableText = [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone,
        employee.departmentName,
        employee.roleName,
        employee.status
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(search);
    });
}


  /**
   * Rebuild rows using latest master data.
   */
  private rebuildTable(): void {

    const employees =
      this.employeeService.getCurrentEmployees();

    this.dataSource.data =
      this.buildTableRows(employees);
  }


  private buildTableRows(
    employees: Employee[]
  ): EmployeeTableRow[] {

    const departments =
      this.sharedService.getDepartments();

    const roles =
      this.sharedService.getRoles();

    return employees.map(employee => {

      const department =
        departments.find(
          item => item.id === employee.department
        );

      const role =
        roles.find(
          item => item.id === employee.role
        );

      return {
        ...employee,

        departmentName:
          department?.name ??
          employee.department ??
          '-',

        roleName:
          role?.name ??
          employee.role ??
          '-'
      };
    });
  }


  onAddEmployee(): void {
    this.router.navigate(['new'], {
      relativeTo: this.activatedRoute
    });
  }

  onViewEmployee(employee: EmployeeTableRow): void {

    this.router.navigate(
      [employee.organizationId, 'view'],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  onEditEmployee(employee: EmployeeTableRow): void {

    this.router.navigate(
      [employee.organizationId, 'edit'],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
  }
}
