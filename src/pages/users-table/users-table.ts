import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users-service';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string-pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { DialogService } from '../../services/dialog-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-table',
  imports: [MatTableModule, DatePipe, GroupsToStringPipe, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit{
  users = signal<User[]>([]);
  usersService = inject(UsersService);
  dialogService = inject(DialogService);
  loggedUser = this.usersService.loggedUser;
  // columns = signal<string[]>(['id', 'name','email', 'active', 'last_login']);
  columns = computed(() => {
    if (this.loggedUser()) {
      return ['id', 'name','email', 'active', 'last_login', 'groups', 'permissions', 'actions'];
    } else {
      return ['id', 'name','email'];
    }
  });

  ngOnInit(): void {
    this.downloadUsers();
  }

  downloadUsers() {
    this.usersService.getExtendedUsers().subscribe(
      (u: User[]) => {
        this.users.set(u);
        console.log('users from server',u); 
      }
    );
  }

  deleteUser(user: User) {
    if (user.id) {
      this.dialogService.confirm(
            "Deleting user",
            "Do you really want to delete user " + user.name + "?")
          .subscribe(decision => {
        if (decision) {
          this.usersService.deleteUser(user.id!).subscribe(success =>{
            if (success) this.downloadUsers();
          });
        }
      })
    }
  }
}
