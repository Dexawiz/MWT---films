import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { User } from '../../entities/user';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  users = signal<User[]>([
    new User('Jakub','kubo@kubo.sk'), 
    new User('Julia', 'julia@kubo.sk', 0, undefined, 'heslo'),
    {name: 'Peter', email: 'p@kubo.sk',password:''}
  ]);
  selectedUser = signal<User|null>(null);

  selectUser(user: User) {
    this.selectedUser.set(user);
  }
}
