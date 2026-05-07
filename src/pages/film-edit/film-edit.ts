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
import { Postava } from '../../entities/postava';
import { Person } from '../../entities/person';
import { MatSelectModule } from '@angular/material/select';
import { FormErrorComponent } from '../../app/shared/form-error/form-error';


@Component({
  selector: 'app-film-edit',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MaterialModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormErrorComponent
  ],
  providers: [FilmsService],
  templateUrl: './film-edit.html',
  styleUrl: './film-edit.scss'
})

export class FilmsEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private filmsService = inject(FilmsService);
  nazov = signal<string>('');
  slovenskyNazov = signal<string>('');
  rok = signal<number | null>(null);
  imdbID = signal<string>('');
  reziser = signal<Person[]>([]);
  postava = signal<Postava[]>([]);
  poradieVRebricku = signal<{[name: string]: number}>({});
  id = signal<number | undefined>(undefined);

  cardTitle = computed(() => this.id() ? 'Upraviť film' : 'Pridať film');

  errors = signal<{ nazov?: string; rok?: string; imdbID?: string; reziser?: string }>({});

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.poradieVRebricku = signal<{[name: string]: number}>({
      'AFI 1998': 0,
      'AFI 2007': 0
    });
    
    if (id) {
      this.filmsService.getFilmById(Number(id)).subscribe({
        next: (film) => {
          console.log('Načítaný film:', film);
          this.nazov.set(film.nazov);
          this.slovenskyNazov.set(film.slovenskyNazov);
          this.rok.set(film.rok);
          this.imdbID.set(film.imdbID);
          this.reziser.set(film.reziser);
          this.postava.set(film.postava);
          this.poradieVRebricku.set(film.poradieVRebricku);
          this.id.set(film.id);
        },
        error: (err) => {
          console.error('Chyba pri načítaní filmu:', err);
        }
      });
    } else {
      console.log('Režim pridávania nového filmu (id sa nenašlo).');
    }
  }


  ulozit() {
    const aktualnyNazov = this.nazov().trim();
    const aktualnyRok = this.rok();
    const aktualnyimdbID = this.imdbID().trim();

    const platniReziseri = this.reziser().filter(r => 
      (r.krstneMeno && r.krstneMeno.trim() !== '') || 
      (r.priezvisko && r.priezvisko.trim() !== '')
    );

    const noveChyby: { nazov?: string; rok?: string; imdbID?: string; reziser?: string } = {};

    if (!aktualnyNazov) {
      noveChyby.nazov = 'Originálny názov filmu je povinný.';
    }

    if (!aktualnyRok || aktualnyRok < 1800 || aktualnyRok > 2100) {
      noveChyby.rok = 'Prosím, zadajte platný rok výroby (1800 - 2100).';
    }

    if (!aktualnyimdbID) {
      noveChyby.imdbID = 'Prosím, zadajte platné IMDb ID.';
    }

    if (platniReziseri.length === 0) {
      noveChyby.reziser = 'Prosím, zadajte aspoň jedného režiséra.';
    }

    this.errors.set(noveChyby);

    if (Object.keys(noveChyby).length > 0) {
      console.error('Validácia zlyhala:', noveChyby);
      return;
    }

    const platnePostavy = this.postava().filter(p => 
      (p.postava && p.postava.trim() !== '') || 
      (p.herec && (
        (p.herec.krstneMeno && p.herec.krstneMeno.trim() !== '') || 
        (p.herec.priezvisko && p.herec.priezvisko.trim() !== '')
      ))
    )

    const filmNaUlozenie = {
      id: this.id(), 
      nazov: aktualnyNazov,
      slovenskyNazov: this.slovenskyNazov().trim(),
      rok: Number(aktualnyRok), 
      imdbID: this.imdbID().trim(),
      reziser: platniReziseri,
      postava: platnePostavy,
      poradieVRebricku: this.poradieVRebricku()
    };

    console.log('Odosielam validovaný film na server:', filmNaUlozenie);

    this.filmsService.saveFilm(filmNaUlozenie).subscribe({
      next: (ulozenyFilm) => {
        console.log('Film úspešne uložený!', ulozenyFilm);
        this.router.navigate(['/films']);
      },
      error: (chyba) => {
        console.error('Chyba pri ukladaní filmu:', chyba);
        alert('Nepodarilo sa uložiť film. Skontrolujte konzolu pre viac detailov.');
      }
    });
  }

  updateReziser(index: number, pole: string, hodnota: string) {
    this.errors.update(prev => ({ ...prev, reziser: undefined }));
    this.reziser.update(stariReziseri => {
      const novyZoznam = [...stariReziseri];
      novyZoznam[index] = { ...novyZoznam[index], [pole]: hodnota };
      return novyZoznam;
    });
  }


  pridatRezisera() {
    this.errors.update(prev => ({ ...prev, reziser: undefined }));
    this.reziser.update(stari => [
      ...stari, 
      { krstneMeno: '', stredneMeno: '', priezvisko: '' } as Person
    ]);
  }

  // Method for updating a specific field of a Postava at a given index

  updatePostava(index: number, pole: string, hodnota: string) {
    this.postava.update(starePostavy => {
      const novyZoznam = [...starePostavy];
      novyZoznam[index] = { ...novyZoznam[index], [pole]: hodnota };
      return novyZoznam;
    });
  }

  // Method for updating a specific field of the Herec within a Postava at a given index

  updateHerecVPostave(index: number, pole: string, hodnota: string) {
    this.postava.update(starePostavy => {
      const novyZoznam = [...starePostavy];
      const staraPostava = novyZoznam[index];
      novyZoznam[index] = { 
        ...staraPostava, 
        herec: { ...staraPostava.herec, [pole]: hodnota } 
      };
      
      return novyZoznam;
    });
  }

  pridatPostavu() {
    this.postava.update(stare => [
      ...stare, 
      {
        postava: '',
        dolezitost: 'vedľajšia postava',
        herec: { krstneMeno: '', stredneMeno: '', priezvisko: '' }
       } as Postava
    ]);
  }

  odstranitRezisera(index: number) {
    this.reziser.update(stari => stari.filter((_, i) => i !== index));
  }

  odstranitPostavu(index: number) {
    this.postava.update(stare => stare.filter((_, i) => i !== index));
  }

  updateRanking(name: string, value: any) {
    this.poradieVRebricku.update(current => ({
      ...current,
      [name]: Number(value)
    }));
  }

  updateNazov(value: string) {
    this.nazov.set(value);
    this.errors.update(prev => ({ ...prev, nazov: undefined }));
  }

  updateRok(value: string) {
    this.rok.set(value ? Number(value) : null);
    this.errors.update(prev => ({ ...prev, rok: undefined }));
  }

  updateImdbID(value: string) {
    this.imdbID.set(value);
    this.errors.update(prev => ({ ...prev, imdbID: undefined }));
  }
}