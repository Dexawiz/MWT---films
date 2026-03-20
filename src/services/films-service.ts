import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from '../entities/film';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getTokenHeader(): {[header:string]: string} | undefined {
    if (this.token) {
      return {'X-Auth-Token': this.token}
    }
    return undefined;
  }

  getFilms(orderBy?:string, descending?: boolean, indexFrom?: number, indexTo?: number, search?: string): Observable<FilmsResponse> {
    let httpParams: HttpParams = new HttpParams();
    if (orderBy) httpParams = httpParams.set('orderBy', orderBy);
    if (descending) httpParams = httpParams.set('descending', descending);
    if (indexFrom) httpParams = httpParams.set('indexFrom', indexFrom);
    if (indexTo) httpParams = httpParams.set('indexTo', indexTo);
    if (search) httpParams = httpParams.set('search', search);
    let options = { params: httpParams, headers: this.getTokenHeader()};
    return this.http.get<FilmsResponse>(this.url + 'films', options).pipe(
      catchError(error =>  this.usersService.processError(error))
    );
  }
}

export interface FilmsResponse {
  items: Film[],
  totalCount: number
}