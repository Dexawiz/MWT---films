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
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSlideToggleModule, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit implements OnInit{
  hide = signal(true);
  usersService = inject(UsersService);
  allGroups = signal<Group[]>([]);

  userModel = new FormGroup({
    login: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    active: new FormControl(true),
    groups: new FormArray([])
  });

  ngOnInit(): void {
    this.usersService.groups().subscribe(groups => {
      this.allGroups.set(groups);
      groups.forEach(group => (this.userModel.get('groups') as FormArray).push(new FormControl(false)))
    })  
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
  onSubmit(event: any) {

  }
}
