import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Employee, EmployeeStatus } from '../models/employee.interface';
import { MasterData } from '../../models/shared.interface';
import { PageLayout } from '../../layouts/page-layout/page-layout';
import { EmployeeService } from '../employee-services/Employee.service';
import { SharedService } from '../../services/shared.service';

type ViewMode = 'add' | 'edit' | 'view';

@Component({
  selector: 'app-add-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,

    PageLayout
  ],
  templateUrl: './add-edit-employee.html',
  styleUrl: './add-edit-employee.scss'
})
export class AddEditEmployee implements OnInit {

  mode: ViewMode = 'add';
  employeeId: string | null = null;

  loading = false;
  saving = false;

  departments: MasterData[] = [];
  roles: MasterData[] = [];

  statuses: { id: EmployeeStatus; name: string }[] = [
    {
      id: 'active',
      name: 'Active'
    },
    {
      id: 'inactive',
      name: 'Inactive'
    }
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private lookupService: SharedService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      organizationId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: [null],
      role: [null],
      status: ['active']
    });
  }

  ngOnInit(): void {

    // Load cached lookup data
    this.departments = this.lookupService.getDepartments();
    this.roles = this.lookupService.getRoles();

    // Read route data
    const routeView =
      this.route.snapshot.data['view'] as 'new' | 'edit' | 'view';

    this.mode = routeView === 'new' ? 'add' : routeView;

    this.employeeId =
      this.route.snapshot.paramMap.get('id');

    // Load employee for edit/view
    if (this.mode !== 'add' && this.employeeId) {
      this.loadEmployee(this.employeeId);
    }

    // View mode = read only
    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get pageTitle(): string {

    if (this.mode === 'add') {
      return 'Add Employee';
    }

    if (this.mode === 'edit') {
      return 'Edit Employee';
    }

    return 'Employee Details';
  }

  private loadEmployee(id: string): void {

    this.loading = true;

    this.employeeService.getById(id).subscribe({

      next: (employee) => {

        this.form.patchValue(employee);

        this.loading = false;
      },

      error: () => {

        this.loading = false;

        this.snackBar.open(
          'Failed to load employee details',
          'Close',
          {
            duration: 3000
          }
        );
      }
    });
  }

  onEdit(): void {

    if (!this.employeeId) {
      return;
    }

    this.router.navigate(
      ['../edit'],
      {
        relativeTo: this.route
      }
    );
  }

  onCancel(): void {

    if (this.mode === 'edit' && this.employeeId) {

      this.router.navigate(
        ['../view'],
        {
          relativeTo: this.route
        }
      );

      return;
    }

    this.router.navigate(['/employees']);
  }

  onSave(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.saving = true;

    const payload: Employee =
      this.form.getRawValue();

    const request$ =
      this.mode === 'add'
        ? this.employeeService.create(payload)
        : this.employeeService.update(
            this.employeeId as string,
            payload
          );

    request$.subscribe({

      next: (savedEmployee) => {

        this.saving = false;

        this.snackBar.open(
          `Employee ${
            this.mode === 'add'
              ? 'created'
              : 'updated'
          } successfully`,
          'Close',
          {
            duration: 3000
          }
        );

        const id =
          savedEmployee._id ??
          this.employeeId;

        this.router.navigate([
          '/employees',
          id,
          'view'
        ]);
      },

      error: () => {

        this.saving = false;

        this.snackBar.open(
          'Failed to save employee',
          'Close',
          {
            duration: 3000
          }
        );
      }
    });
  }
}