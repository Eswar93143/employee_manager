import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import {
  BehaviorSubject,
  Subject,
  combineLatest,
  filter,
  map,
  takeUntil
} from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Employee } from './models/employee.interface';
import { MasterData } from '../models/shared.interface';
import { PageLayout } from '../layouts/page-layout/page-layout';
import { EmployeeService } from './employee-services/Employee.service';
import { SharedService } from '../services/shared.service';


interface EmployeeTableRow extends Employee {
  departmentName: string;
  roleName: string;
}


@Component({
  selector: 'app-employees',
  standalone: true,

  imports: [
    RouterOutlet,

    // Page layout
    PageLayout,

    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],

  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class EmployeesComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  /**
   * Current route view.
   *
   * list
   * new
   * edit
   * view
   */
  view = 'list';


  /**
   * Employee table columns.
   */
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'department',
    'role',
    'status',
    'actions'
  ];


  /**
   * Material table data source.
   */
  dataSource =
    new MatTableDataSource<EmployeeTableRow>([]);


  /**
   * Search text.
   *
   * This is temporary and is NOT stored
   * inside EmployeeService.
   */
  searchTerm = '';


  /**
   * Complete transformed employee list.
   *
   * This contains department/role names.
   */
  private allTableRows: EmployeeTableRow[] = [];


  /**
   * Destroy notifier.
   */
  private readonly destroy$ =
    new Subject<void>();


  constructor(
    private readonly employeeService: EmployeeService,
    private readonly sharedService: SharedService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}


  ngOnInit(): void {

    // Detect current route view.
    this.listenToRoute();

    // Fetch employees only when they are
    // not already loaded.
    this.loadEmployees();

    // Listen to employee + lookup changes.
    this.listenToDataChanges();
  }


  ngAfterViewInit(): void {

    this.dataSource.paginator =
      this.paginator;
  }


  /**
   * Detect whether the current route is:
   *
   * /employees
   * /employees/new
   * /employees/:id/edit
   * /employees/:id/view
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


  /**
   * Read view from router data.
   */
  private updateView(): void {

    const childRoute =
      this.activatedRoute.firstChild;

    this.view =
      childRoute?.snapshot.data?.['view']
      ??
      this.activatedRoute.snapshot.data?.['view']
      ??
      'list';
  }


  /**
   * Fetch employees only if EmployeeService
   * doesn't already have them.
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
   * Listen for:
   *
   * 1. Employee changes
   * 2. Department changes
   * 3. Role changes
   *
   * Whenever any of them changes,
   * the table is rebuilt.
   */
  private listenToDataChanges(): void {

    combineLatest([
      this.employeeService.employees$,
      this.sharedService.departments$,
      this.sharedService.roles$
    ])
      .pipe(
        map(
          ([
            employees,
            departments,
            roles
          ]) => {

            return this.buildTableRows(
              employees,
              departments,
              roles
            );

          }
        ),

        takeUntil(this.destroy$)
      )
      .subscribe(rows => {

        this.allTableRows = rows;

        this.applySearch();

      });
  }


  /**
   * Convert employee GUIDs into
   * display names.
   */
  private buildTableRows(
    employees: Employee[],
    departments: MasterData[],
    roles: MasterData[]
  ): EmployeeTableRow[] {

    return employees.map(employee => {

      const department =
        departments.find(
          item =>
            item.id === employee.department
        );

      const role =
        roles.find(
          item =>
            item.id === employee.role
        );

      return {

        ...employee,

        departmentName:
          department?.name
          ??
          employee.department
          ??
          '-',

        roleName:
          role?.name
          ??
          employee.role
          ??
          '-'

      };

    });
  }


  /**
   * Search employees.
   *
   * Search result is temporary.
   *
   * EmployeeService is NOT modified.
   */
  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm =
      input.value
        .trim()
        .toLowerCase();

    this.applySearch();
  }


  /**
   * Apply temporary search.
   */
  public applySearch(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    if (!search) {

      this.dataSource.data =
        this.allTableRows;

      return;
    }


    this.dataSource.data =
      this.allTableRows.filter(
        employee => {

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

        }
      );
  }


  /**
   * Clear search.
   */
  clearSearch(): void {

    this.searchTerm = '';

    this.applySearch();
  }


  /**
   * Navigate to add employee.
   */
  onAddEmployee(): void {

    this.router.navigate(
      ['new'],
      {
        relativeTo:
          this.activatedRoute
      }
    );
  }


  /**
   * Navigate to employee view.
   */
  onViewEmployee(
    employee: EmployeeTableRow
  ): void {

    this.router.navigate(
      [
        employee.organizationId,
        'view'
      ],
      {
        relativeTo:
          this.activatedRoute
      }
    );
  }


  /**
   * Navigate to employee edit.
   */
  onEditEmployee(
    employee: EmployeeTableRow
  ): void {

    this.router.navigate(
      [
        employee.organizationId,
        'edit'
      ],
      {
        relativeTo:
          this.activatedRoute
      }
    );
  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }
}