import { Routes } from '@angular/router';
import { UsersTable } from '../pages/users-table/users-table';
import { Login } from '../pages/login/login';
import { PageNotFound } from '../pages/page-not-found/page-not-found';
import { UserEdit } from '../pages/user-edit/user-edit';
import { authGuard, authMatchGuard } from '../guards/auth-guard';
import { canDeactivateGuard } from '../guards/can-deactivate-guard';

export const routes: Routes = [
  {path: 'users', component: UsersTable, 
    canActivate:[authGuard]},
  {path: 'login', component: Login},
  {path: 'register',
    loadComponent: () => import('../pages/register/register')
  },
  {path: 'user/new', component: UserEdit, 
    data: {myValue: 'haha'},
    canActivate:[authGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {path: 'user/edit/:id', component: UserEdit,
    canActivate:[authGuard],
    canDeactivate: [canDeactivateGuard]},
  {path: 'groups', 
    loadChildren:() => import('../modules/groups/groups-module').then(mod => mod.GroupsModule),
    canMatch:[authMatchGuard]
  },
  {path: '', redirectTo:'/login', pathMatch: 'full'},
  {path: '**', component: PageNotFound}
];
