import { Component, inject, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { Auth } from '../../entities/auth';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  usersService = inject(UsersService);
  router = inject(Router);
  hide = signal(true);
  errorMessage = signal<string>('');
  auth = new Auth("Peter","sovy");
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
  getAuthJson() {
    return JSON.stringify(this.auth);
  }
  nameChanged(event: any) {
    this.auth.name = event.target.value;
  }
  onSubmit() {
    this.usersService.login(this.auth).subscribe({
      next: success => {
        if (success) {
          this.router.navigateByUrl('/users');
        } else {
          this.errorMessage.set("Wrong name or password, try again.");
        }
      },
      error: err => {
        this.errorMessage.set("Server is down.");
      }
    });
  }
}
