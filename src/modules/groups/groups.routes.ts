import { Routes } from "@angular/router";
import { GroupsList } from "./groups-list/groups-list";
import { GroupsMenu } from "./groups-menu/groups-menu";
import { GroupEdit } from "./group-edit/group-edit";
import { groupResolveGuard } from "../../guards/group-resolve.guard";

export const routes: Routes = [
  {path: '', component: GroupsMenu,
    children: [
      {path: 'list', component: GroupsList},
      {path: 'new', component: GroupEdit},
      {path: 'edit/:id', component: GroupEdit,
        resolve: {
          group: groupResolveGuard
        },
        data: {
          daco: 'nieco'
        }
      },
      {path: '', redirectTo:'list', pathMatch: 'full'},
    ]
  }
];