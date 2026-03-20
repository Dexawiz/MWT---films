import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material-module';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films-service';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-films',
  imports: [MaterialModule],
  templateUrl: './films.html',
  styleUrl: './films.scss',
})
export default class Films implements OnInit{
  usersService = inject(UsersService);
  filmsService = inject(FilmsService);
  films = signal<Film[]>([]);
  loggedUser = this.usersService.loggedUser;

//  columns = signal<string[]>(['id', 'nazov', 'rok']);
  columns = computed(() => this.loggedUser()
    ? ['id', 'nazov', 'slovenskyNazov', 'rok', 'afi1998', 'afi2007']
    : ['id', 'nazov', 'rok']
  );

  ngOnInit(): void {
    this.filmsService.getFilms('slovenskyNazov', true).subscribe(filmsReponse => {
      this.films.set(filmsReponse.items);
      console.log('recieved films response' , filmsReponse);
    });
  }
}
