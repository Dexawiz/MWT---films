import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users-service';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string-pipe';

@Component({
  selector: 'app-users-table',
  imports: [MatTableModule, DatePipe, GroupsToStringPipe],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit{
  users = signal<User[]>([]);
  usersService = inject(UsersService);
  loggedUser = this.usersService.loggedUser;
  // columns = signal<string[]>(['id', 'name','email', 'active', 'last_login']);
  columns = computed(() => {
    if (this.loggedUser()) {
      return ['id', 'name','email', 'active', 'last_login', 'groups', 'permissions'];
    } else {
      return ['id', 'name','email'];
    }
  });

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(
      (u: User[]) => {
        this.users.set(u);
        console.log('users from server',u); 
      }
    );
  }
}
