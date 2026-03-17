import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../services/users-service';
import { Group } from '../../../entities/group';
import { GroupEditChild } from '../../../components/group-edit-child/group-edit-child';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-groups-list',
  imports: [GroupEditChild, MatButtonModule, MatIconModule],
  templateUrl: './groups-list.html',
  styleUrl: './groups-list.scss',
})
export class GroupsList implements OnInit{
  usersService = inject(UsersService);
  groups = signal<Group[]>([]);
  selectedGroup = signal<Group | undefined>(undefined);

  constructor(){
    effect(() => console.log('new selected group:', this.selectedGroup()));
  }

  ngOnInit(): void {
    this.usersService.groups().subscribe(g => this.groups.set(g));
  }
  onEditClick(group:Group) {
    this.selectedGroup.set(group);
  }
  onGroupSaved(group:Group) {
    this.groups.update(previous => {
      const index = previous.findIndex(g => g.id === group.id);
      if (index < 0) return [...previous, group];
      return previous.map((g,i) => i === index ? group : g);
    });
  }
}
