import { inject, Injectable } from '@angular/core';
import { User } from '../entities/user';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);
  users: User[] = [
    new User('JakubService','kubo@kubo.sk'), 
    new User('JuliaService', 'julia@kubo.sk', 0, undefined, 'heslo')
  ];

  getLocalUsers(): User[] {
    return this.users;
  }
  getLocalUsersAsync(): Observable<User[]> {
    return of(this.users);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/users').pipe(
      map(jsonUsers => jsonUsers.map(user => User.clone(user)))
    )
  }
}
