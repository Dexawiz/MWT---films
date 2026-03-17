import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-groups-menu',
  imports: [RouterOutlet, MatTabsModule, RouterLink, RouterLinkActive],
  templateUrl: './groups-menu.html',
  styleUrl: './groups-menu.scss',
})
export class GroupsMenu {
  activeTab = signal('');

  setActiveTab(name: string, isActive:boolean) {
    // console.log('[active, name]', isActive, name);
    if (isActive) {
      this.activeTab.set(name);
    }
  }
}
