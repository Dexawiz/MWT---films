import { Component, computed, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material-module';
import { form, FormField } from '@angular/forms/signals';
import { UsersService } from '../../services/users-service';
import { Group } from '../../entities/group';
import { MessageService } from '../../services/message-service';

@Component({
  selector: 'app-group-edit-child',
  imports: [MaterialModule, FormField],
  templateUrl: './group-edit-child.html',
  styleUrl: './group-edit-child.scss',
})
export class GroupEditChild {
  usersService = inject(UsersService);
  messageService = inject(MessageService);
  
  group = input<Group>();
  groupSaved = output<Group>();
  
  constructor() {
    effect(() => console.log('new input: ', this.group()));
  }

  //id = signal<number|undefined>(undefined);
  // model = signal({
  //   name: '',
  //   permissions: ''
  // });
  model = linkedSignal(() => {
    const g = this.group();
    const permString = g 
                       ? g.permissions.join(', ')
                       : '';
    return { name: g?.name || '',
             permissions: permString
           }
  });
  id = computed(() => this.group()?.id);
  groupForm = form(this.model);



  onSave(event:any) {
    event.preventDefault();
    const perms = this.model().permissions.split(',').map(value => value.trim()).filter(value => value); 
    const groupToSave = new Group(this.model().name, perms, this.id());
    this.usersService.saveGroup(groupToSave).subscribe(saved => {
      this.messageService.successMessage('Group ' + saved.name + ' saved');
      this.groupSaved.emit(saved);
    });
  }
}
