import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../entities/group';

@Pipe({
  name: 'groupsToString',
})
export class GroupsToStringPipe implements PipeTransform {

  transform(groups: Group[], option?:string): string {
    if (option === 'permissions') {
      return 'prava';
    } else {
      return groups.map(g => g.name).join(', ');
    }
  }

}
