import { Component, inject, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { DEFAULT_NAVIGATE_AFTER_LOGIN, UsersService } from '../../services/users-service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{
  usersService = inject(UsersService);
  loggedUser = this.usersService.loggedUser;
  router = inject(Router);
  
  ngOnInit(): void {
    
  }
  logout() {
    this.usersService.navigateAfterLogin = DEFAULT_NAVIGATE_AFTER_LOGIN;
    this.usersService.logout().subscribe(success =>
      this.router.navigateByUrl('/login'));
  }
}
