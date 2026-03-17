import { Component, inject, signal } from '@angular/core';
import { GroupEditChild } from "../../../components/group-edit-child/group-edit-child";
import { Group } from '../../../entities/group';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-edit',
  imports: [GroupEditChild],
  templateUrl: './group-edit.html',
  styleUrl: './group-edit.scss',
})
export class GroupEdit {
  router = inject(Router);
  group = signal<Group>(new Group('',[]));

  saved(savedGroup: Group) {
    this.router.navigateByUrl('./list');
  }
}
