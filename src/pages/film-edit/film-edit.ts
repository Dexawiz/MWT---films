import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material-module';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FilmsService } from '../../services/films-service';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-film-edit',
  standalone: true,
  imports: [FormsModule,
    RouterLink,
    MatCardModule,      
    MatFormFieldModule,
    MatInputModule,    
    MatButtonModule,   
    MatIconModule,
    MatDividerModule],
  templateUrl: './film-edit.html',
  styleUrl: './film-edit.scss'
})


export class FilmsEdit implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private filmsService = inject(FilmsService);

  id = signal<number | undefined>(undefined);
  nazov = signal('');
  rok = signal<number>(new Date().getFullYear());
  imdbID = signal('');
  reziseri = signal<any[]>([]); 
  postavy = signal<any[]>([]);

  isFormValid = computed(() => {
    return this.nazov().trim().length > 0 && this.rok() > 1800;
  });
    ngOnInit() {
      const filmId = this.route.snapshot.paramMap.get('id');
      if (filmId) {
        this.filmsService.getFilmById(+filmId).subscribe(film => {
          this.id.set(film.id);
          this.nazov.set(film.nazov);
          this.rok.set(film.rok);
          this.imdbID.set(film.imdbID);
          this.reziseri.set(film.reziser);
          this.postavy.set(film.postava);
        });
      }
    }

    removeDirector(index: number) {
      this.reziseri.update(list => list.filter((_, i) => i !== index));
    }

    addDirector() {
      this.reziseri.update(list => [
      ...list, 
      { krstneMeno: '', priezvisko: '', stredneMeno: '' } 
      ]);
    }

    removeCharacter(index: number) {
    this.postavy.update(list => list.filter((_, i) => i !== index));
    }

    addCharacter() {
      this.postavy.update(list => [
        ...list, 
        { postava: '', dolezitost: 'vedľajšia postava', herec: { krstneMeno: '', priezvisko: '', stredneMeno: '' } }
      ]);
    }

    cancel() {
      this.router.navigate(['/films']);
    }

    save() {
    const filmData = {
      id: this.id(),
      nazov: this.nazov(),
      rok: this.rok(),
      imdbID: this.imdbID(),
      reziser: this.reziseri(),
      postava: this.postavy()
    };

  
    console.log('Ukladám:', filmData);
  }
}


