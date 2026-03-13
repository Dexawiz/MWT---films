import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-groups-menu',
  imports: [RouterOutlet, MatTabsModule, RouterLink, RouterLinkActive],
  templateUrl: './groups-menu.html',
  styleUrl: './groups-menu.scss',
})
export class GroupsMenu {

}
