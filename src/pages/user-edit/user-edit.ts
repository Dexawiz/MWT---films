import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UsersService } from '../../services/users-service';
import { Group } from '../../entities/group';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MessageService } from '../../services/message-service';
import { User } from '../../entities/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { concat, filter, map, Observable, switchMap, tap } from 'rxjs';
import { CanComponentDeactivate } from '../../guards/can-deactivate-guard';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-user-edit',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSlideToggleModule, MatCheckboxModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit implements OnInit, CanComponentDeactivate {
  hide = signal(true);
  usersService = inject(UsersService);
  messsageService = inject(MessageService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogService);
  allGroups = signal<Group[]>([]);
  title = signal('Insert new user');
  userId = signal<number|undefined>(undefined);
  saved = false;

  userModel = new FormGroup({
    login: new FormControl('', {validators: Validators.required,
                                asyncValidators: this.conflictValidator('login')
                                }),
    email: new FormControl('', [Validators.required,
                                Validators.email, 
                                Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/)], this.conflictValidator('email')),
    password: new FormControl(''),
    active: new FormControl(true),
    groups: new FormArray<FormControl<boolean>>([])
  });

  conflictValidator(field:string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const name = field === 'login' ? control.value : '';
        const email = field === 'email' ? control.value : '';
        const user = new User(name, email, this.userId());
        return this.usersService.userConflicts(user).pipe(
          map(result => {
            if (result.length > 0) {
              const firstWord = field === 'login' ? "User" : "E-mail"
              return {serverConflict : firstWord + ' already present on server'}
            }
            return null;
          })
        );
    }
  }

  ngOnInit(): void {
    // const id = Number(this.activatedRoute.snapshot.params['id']);
    // if (id || id === 0) {
    //   this.title.set('Editing user with id ' + id);
    //   this.userId.set(id);
    // }
    const getGroups$ = this.usersService.groups().pipe(
      tap(groups => {
          this.allGroups.set(groups);
          groups.forEach(group => (this.groups.push(new FormControl(false))));
      })
    );

    const processUrl$ = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.has('id') ? Number(paramMap.get('id')) : NaN),
      filter(id => ! Number.isNaN(id)),
      tap(id => {
        this.title.set('Editing user with id ' + id);
        this.userId.set(id);
      }),
      switchMap(id => this.usersService.getUser(id)),
      tap(user => {
        this.userModel.patchValue({
          login: user.name,
          email: user.email,
          active: user.active
        });
        this.allGroups().forEach((g, index) => {
          const hasGroup = user.groups.some(ug => ug.id === g.id);
          this.groups.at(index).setValue(hasGroup);
        });
        //this.userModel.get('login')?.setValue(user.name);
      })
    );
    concat(getGroups$, processUrl$).subscribe();
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
  onSubmit(event: any) {
    const data = this.userModel.value;
    console.log(data);
    const userGroups = this.allGroups().filter((g,index) => data.groups![index]);
    const user = new User(data.login || '', 
                          data.email || '',
                          this.userId(),
                          undefined,
                          data.password || '',
                          data.active || false ,
                          userGroups);
    this.usersService.saveUser(user).subscribe(savedUser => {
      this.messsageService.successMessage("User " + savedUser.name + " saved successfully");
      this.saved = true;
      this.router.navigateByUrl('/users');
    });
  }
  getJson(obj:any) {
    return JSON.stringify(obj);
  }

  canDeactivate(): boolean | Observable<boolean> {
    console.log('deactivating');
    if (this.saved) return true;
    const edited = this.userModel.dirty;
    if (edited) {
      return this.dialogService.confirm('Form not saved', 'Do you really want to leave without saving this user?')
    }
    return true;
  }

  get login(): FormControl<string|undefined> {
    return this.userModel.get('login') as FormControl;
  }
  get email(): FormControl<string|undefined> {
    return this.userModel.get('email') as FormControl;
  }
  get groups(): FormArray {
    return this.userModel.get('groups') as FormArray;
  }
}
