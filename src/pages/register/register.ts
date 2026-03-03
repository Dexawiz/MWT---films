import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, pattern, required, validate } from '@angular/forms/signals';
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
    })
  });

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
