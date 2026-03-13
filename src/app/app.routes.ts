import { Routes } from '@angular/router';
import { UsersTable } from '../pages/users-table/users-table';
import { Login } from '../pages/login/login';
import { PageNotFound } from '../pages/page-not-found/page-not-found';
import { UserEdit } from '../pages/user-edit/user-edit';

export const routes: Routes = [
  {path: 'users', component: UsersTable},
  {path: 'login', component: Login},
  {path: 'register',
    loadComponent: () => import('../pages/register/register')
  },
  {path: 'user/new', component: UserEdit, data: {myValue: 'haha'}},
  {path: 'user/edit/:id', component: UserEdit},
  {path: 'groups', 
    loadChildren:() => import('../modules/groups/groups-module').then(mod => mod.GroupsModule)
  },
  {path: '', redirectTo:'/login', pathMatch: 'full'},
  {path: '**', component: PageNotFound}
];
