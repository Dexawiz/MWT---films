import { NgModule } from '@angular/core';
import { GroupsList } from './groups-list/groups-list';
import { RouterModule } from '@angular/router';
import { routes } from './groups.routes';

@NgModule({
  declarations: [],
  imports: [
    GroupsList,
    RouterModule.forChild(routes)
  ],
  exports: [
    GroupsList
  ]
})
export class GroupsModule { }
