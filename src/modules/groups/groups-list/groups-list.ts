import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../../services/users-service';
import { Group } from '../../../entities/group';

@Component({
  selector: 'app-groups-list',
  imports: [],
  templateUrl: './groups-list.html',
  styleUrl: './groups-list.scss',
})
export class GroupsList implements OnInit{
  usersService = inject(UsersService);
  groups = signal<Group[]>([]);

  ngOnInit(): void {
    this.usersService.groups().subscribe(g => this.groups.set(g));
  }
}
