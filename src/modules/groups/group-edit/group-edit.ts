import { Component, inject, OnInit, signal } from '@angular/core';
import { GroupEditChild } from "../../../components/group-edit-child/group-edit-child";
import { Group } from '../../../entities/group';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-edit',
  imports: [GroupEditChild],
  templateUrl: './group-edit.html',
  styleUrl: './group-edit.scss',
})
export class GroupEdit implements OnInit{
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  group = signal<Group>(new Group('',[]));

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      if (data['group']) {
        console.log('editing group ', data['group']);
        this.group.set(data['group']);
      }
    })
  }
  saved(savedGroup: Group) {
    this.router.navigateByUrl('./list');
  }
}
