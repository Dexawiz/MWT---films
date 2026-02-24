import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users = signal<User[]>([
    new User('Jakub','kubo@kubo.sk'), 
    new User('Julia', 'julia@kubo.sk', 0, undefined, 'heslo'),
    {name: 'Peter', email: 'p@kubo.sk',password:'',active: true, groups: []}
  ]);
  selectedUser = signal<User|null>(null);
  errorMessage = signal<string>('');

  constructor(
    private usersService: UsersService
  ){}
  ngOnInit(): void {
    // this.users.set(this.usersService.getLocalUsers());
    this.usersService.getUsers()
                     .subscribe({
                        next: (u: User[]) => this.users.set(u),
                        error: (error) => this.errorMessage.set('Server is down!')
                      });
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
  }
}
