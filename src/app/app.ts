import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Users } from '../components/users/users';
import { UsersTable } from "../pages/users-table/users-table";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Users, UsersTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('films');
}
