import { inject, Injectable, signal } from '@angular/core';
import { User } from '../entities/user';
import { catchError, EMPTY, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../entities/auth';
import { MessageService } from './message-service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  serverUrl = "http://localhost:8080/";

  http = inject(HttpClient);
  messageService = inject(MessageService);
//  token = '';
  users: User[] = [
    new User('JakubService','kubo@kubo.sk'), 
    new User('JuliaService', 'julia@kubo.sk', 0, undefined, 'heslo')
  ];
  loggedUser = signal<string>(this.savedUserName);

  set token(value: string) {
    localStorage.setItem('filmsToken', value);
    if (!value) {
      this.savedUserName = '';
    }
  }

  get token(): string {
    return localStorage.getItem('filmsToken') || '';
  }

  set savedUserName(value: string) {
    localStorage.setItem('filmsUserName', value);
    this.loggedUser.set(value);
  }
  get savedUserName(): string {
    return localStorage.getItem('filmsUserName') || '';
  }

  getLocalUsers(): User[] {
    return this.users;
  }
  getLocalUsersAsync(): Observable<User[]> {
    return of(this.users);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serverUrl + 'users').pipe(
      map(jsonUsers => jsonUsers.map(user => User.clone(user))),
      catchError(error => this.processError(error))
    )
  }
  getExtendedUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.serverUrl}users/${this.token}`).pipe(
      map(jsonUsers => jsonUsers.map(user => User.clone(user))),
      catchError(error => this.processError(error))
    );
  }
  login(auth: Auth): Observable<boolean> {
    return this.http.post(this.serverUrl + 'login', auth, {responseType: 'text'}).pipe(
      tap(token => {
         this.token = token;
         this.savedUserName = auth.name;
         this.messageService.successMessage("User loggged in successfully");
      }),
      map(token => true),
      catchError(error => this.processError(error))
    );
  }
  logout():Observable<boolean> {
    return this.http.get<string>(`${this.serverUrl}logout/${this.token}`).pipe(
      map(() => {
        this.token = '';
        this.messageService.successMessage("Logged out successfully");
        return true;
      }),
      catchError(error => {
        this.token = '';
        this.messageService.successMessage("Logged out (sort of)");
        return of(false);
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.serverUrl + 'register', user).pipe(
      catchError(error => this.processError(error))
    )
  }

  userConflicts(user: User): Observable<string[]> {
    return this.http.post<string[]>(this.serverUrl + 'user-conflicts', user).pipe(
      catchError(error => this.processError(error))
    )
  }

  private processError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.messageService.errorMessage("Server not available");
            return EMPTY;
          }
          if (error.status >= 400 && error.status < 500) {
            const message = error.error.errorMessage || JSON.parse(error.error).errorMessage;
            this.messageService.errorMessage(message);
            return EMPTY;
          }
          if (error.status >= 500) {
            this.messageService.errorMessage("Server has some serious problems, contact administrator.");
          }
    }
    console.error('HTTP connection error',error);
    return EMPTY;
  }
}
