import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, PathKind, pattern, required, SchemaPath, validate, validateAsync } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../services/users-service';
import { User } from '../../entities/user';
import { MessageService } from '../../services/message-service';
import { Router } from '@angular/router';
import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormField],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  usersService = inject(UsersService);
  messageService = inject(MessageService);
  router = inject(Router);
  hide = signal(true);
  passwordStrength = computed(() => {
    const pass = this.registerForm.password().value();
    const analysis = zxcvbn(pass);
    return this.getPasswordStrength(analysis);
  });
  model = signal({
    login: '',
    email: '',
    password: '',
    password2: ''
  });
  registerForm = form(this.model, schemaPath => {
    required(schemaPath.login, {message: "User name is required"}),
    minLength(schemaPath.login, 3, {message: "User name must have at least 3 characters"}),
    email(schemaPath.email, {message: 'E-mail is in wrong format'}),
    pattern(schemaPath.email, /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/,{message: 'E-mail is in wrong format'}),
    validate(schemaPath.password, ({value}) => {
      const password = value();
      const analysis = zxcvbn(password);
      if (analysis.score < 3) {
        return {kind: 'weakPassword', message: 'Weak password, ' + this.getPasswordStrength(analysis) };
      } else {
        return null;
      }
    }),
    validate(schemaPath.password2, ({value, valueOf})=> {
      const password1 = valueOf(schemaPath.password);
      const password2 = value();
      if (password1 === password2) {
        return null;
      }
      return {kind:'differntPasswords', message: 'Passwords do not match'};
    }),
    this.userConflictsValidator(schemaPath.login),
    this.userConflictsValidator(schemaPath.email)
    // validateAsync(schemaPath.login, {
    //   params: ({value}) => {
    //     const name = value();
    //     return new User(name, '')
    //   },
    //   factory:(params) => rxResource<string[], User>({
    //     params: () => params() || new User('',''),
    //     stream: ({params: user}) => this.usersService.userConflicts(user)
    //   }),
    //   onSuccess: (result:string[], context) => {
    //     if (result.length == 0)
    //       return null;
    //     return {kind: 'serverConflict', message: 'User already present on server'}
    //   },
    //   onError: error => null
    // })
  });

  userConflictsValidator(field: SchemaPath<string, 1, PathKind.Child>) {
    validateAsync(field, {
      params: ({value,key}) => {
        const name = key() === 'login' ? value() : '';
        const email = key() === 'email' ? value() : '';
        return new User(name, email)
      },
      factory:(params) => rxResource<string[], User>({
        params: () => params() || new User('',''),
        stream: ({params: user}) => this.usersService.userConflicts(user)
      }),
      onSuccess: (result:string[], context) => {
        if (result.length == 0)
          return null;
        const firstWord = context.key() === 'login' ? "User" : "E-mail"
        return {kind: 'serverConflict', message: firstWord + ' already present on server'}
      },
      onError: error => null
    })
  }

  constructor() {
    const options = {
      translations: zxcvbnEnPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
    }
    zxcvbnOptions.setOptions(options)
  }

  getPasswordStrength(analysis: ZxcvbnResult) {
    return 'strength ' + analysis.score + ' of 4. Crackable in ' + analysis.crackTimesDisplay.offlineSlowHashing1e4PerSecond;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
  onSubmit(event: any) {
    event.preventDefault();
    const data = this.model();
    const user = new User(data.login, data.email, undefined, undefined, data.password);
    this.usersService.register(user).subscribe(savedUser => {
      this.messageService.successMessage("User " + savedUser.name + " created, Please log in now.");
      this.router.navigateByUrl('/login');
    });
    console.log('data to submit:', data);
  }
}
