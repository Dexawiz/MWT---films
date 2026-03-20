import { Component, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material-module';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films-service';

@Component({
  selector: 'app-films',
  imports: [MaterialModule],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export default class Films implements OnInit{
  filmsService = inject(FilmsService);
  films = signal<Film[]>([]);
  columns = signal<string[]>(['id', 'nazov', 'rok']);

  ngOnInit(): void {
    this.filmsService.getFilms().subscribe(filmsReponse => {
      this.films.set(filmsReponse.items);
      console.log('recieved films response' , filmsReponse);
    });
  }
}
