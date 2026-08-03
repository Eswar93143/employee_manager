import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Login } from './auth/login/login';
import { authGuard } from './auth/guard/auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Main,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: Login
    }
];
