import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Film } from '../entities/film';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UsersService } from './users-service';
import id from '@angular/common/locales/extra/id';

// @Injectable({
//   providedIn: 'root',
// })
@Injectable() // nepíšeme providedIn, vytvorí sa nová service pre každý Films komponent, vďaka jeho providers sekcii
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
    if (! Number.isNaN(Number(indexFrom))) httpParams = httpParams.set('indexFrom', indexFrom!);
    if (indexTo) httpParams = httpParams.set('indexTo', indexTo);
    if (search) httpParams = httpParams.set('search', search);
    // let options = { params: httpParams, headers: this.getTokenHeader()};
    let options = { params: httpParams};
    return this.http.get<FilmsResponse>(this.url + 'films', options);
  }

    getFilmById(id: number): Observable<Film> {
      return this.http.get<Film>(`${this.url}films/${id}`);
    }

    deleteFilm(id: number): Observable<any> {
      return this.http.delete(`${this.url}films/${id}`);
    }

    saveFilm(film: Film): Observable<Film> {
      if (film.id) {
        // Update existujúceho filmu
        return this.http.put<Film>(`${this.url}films/${film.id}`, film);
      } else {
        // Vytvorenie nového filmu
        return this.http.post<Film>(`${this.url}films`, film);
      }

    }
}

  
export interface FilmsResponse {
  items: Film[],
  totalCount: number
}

export class FilmsQuery {
  constructor(
    public orderBy?:string, 
    public descending?: boolean, 
    public indexFrom?: number, 
    public indexTo?: number, 
    public search?: string
  ){}
}