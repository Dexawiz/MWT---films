import { inject, Injectable } from '@angular/core';
import { User } from '../entities/user';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../entities/auth';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);
  token = '';
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
  login(auth: Auth): Observable<boolean> {
    return this.http.post('http://localhost:8080/login', auth, {responseType: 'text'}).pipe(
      tap(token => this.token = token),
      map(token => true),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            console.error("server not available");
            return throwError(() => error);
          }
          if (error.status == 401) {
            return of(false);
          }
        }
        console.error("http error", error);
        return throwError(() => error);
      })
    );
  }
}
