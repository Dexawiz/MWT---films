import { Component, inject, OnInit, signal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-users-table',
  imports: [MatTableModule],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit{
  users = signal<User[]>([]);
  usersService = inject(UsersService);

  ngOnInit(): void {
    this.usersService.getExtendedUsers().subscribe(
      (u: User[]) => {
        this.users.set(u);
        console.log('users from server',u); 
      }
    );
  }
}
