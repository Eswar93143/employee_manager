import { Routes } from '@angular/router';

import { Main } from './main/main';
import { Login } from './auth/login/login';
import { authGuard } from './auth/guard/auth-guard';
import { EmployeesComponent } from './main/employees/employees';
import { AddEditEmployee } from './main/employees/add-edit-employee/add-edit-employee';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
      },

      {
        path: 'employees',
        component: EmployeesComponent,
        data: {
          view: 'list'
        },
        children: [

          {
            path: 'new',
            component: AddEditEmployee,
            data: {
              view: 'new'
            }
          },

          {
            path: ':id/edit',
            component: AddEditEmployee,
            data: {
              view: 'edit'
            }
          },

          {
            path: ':id/view',
            component: AddEditEmployee,
            data: {
              view: 'view'
            }
          }

        ]
      }
    ]
  },

  {
    path: 'login',
    component: Login
  }
];