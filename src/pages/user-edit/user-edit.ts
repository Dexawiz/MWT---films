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

@Component({
  selector: 'app-user-edit',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSlideToggleModule, MatCheckboxModule],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit implements OnInit{
  hide = signal(true);
  usersService = inject(UsersService);
  allGroups = signal<Group[]>([]);

  ngOnInit(): void {
    this.usersService.groups().subscribe(groups => {
      this.allGroups.set(groups);
    })  
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
  onSubmit(event: any) {

  }
}
