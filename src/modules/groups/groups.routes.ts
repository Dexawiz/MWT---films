import { Routes } from "@angular/router";
import { GroupsList } from "./groups-list/groups-list";
import { GroupsMenu } from "./groups-menu/groups-menu";
import { GroupEdit } from "./group-edit/group-edit";

export const routes: Routes = [
  {path: '', component: GroupsMenu,
    children: [
      {path: 'list', component: GroupsList},
      {path: 'new', component: GroupEdit},
      {path: 'edit/:id', component: GroupEdit},
      {path: '', redirectTo:'list', pathMatch: 'full'},
    ]
  }
];