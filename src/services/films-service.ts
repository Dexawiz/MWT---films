import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from '../entities/film';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UsersService } from './users-service';

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  http = inject(HttpClient);
  usersService = inject(UsersService);
  url = environment.restServerUrl;

  get token() {
    return this.usersService.token;
  }

  getTokenHeader(): {headers: {[header:string]: string}} | undefined {
    if (this.token) {
      return {headers: {'X-Auth-Token': this.token}}
    }
    return undefined;
  }

  getFilms(): Observable<FilmsResponse> {
    return this.http.get<FilmsResponse>(this.url + 'films', this.getTokenHeader()).pipe(
      catchError(error =>  this.usersService.processError(error))
    );
  }
}

export interface FilmsResponse {
  items: Film[],
  totalCount: number
}