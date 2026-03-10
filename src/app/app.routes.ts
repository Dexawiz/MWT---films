import { Routes } from '@angular/router';
import { UsersTable } from '../pages/users-table/users-table';
import { Login } from '../pages/login/login';
import { PageNotFound } from '../pages/page-not-found/page-not-found';
import { Register } from '../pages/register/register';
import { UserEdit } from '../pages/user-edit/user-edit';

export const routes: Routes = [
  {path: 'users', component: UsersTable},
  {path: 'login', component: Login},
  {path: 'register', component: Register},
  {path: 'user/new', component: UserEdit, data: {myValue: 'haha'}},
  {path: 'user/edit/:id', component: UserEdit},
  {path: '', redirectTo:'/login', pathMatch: 'full'},
  {path: '**', component: PageNotFound}
];
