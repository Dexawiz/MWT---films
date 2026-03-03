import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../entities/group';

@Pipe({
  name: 'groupsToString',
})
export class GroupsToStringPipe implements PipeTransform {

  transform(groups: Group[], option?:string): string {
    if (option === 'permissions') {
      return groups.map(g => g.permissions)
              .flat()
              .reduce((acc:string[], perm) => acc.includes(perm) ? acc : [...acc, perm], [])
              .join(', ');
    } else {
      return groups.map(g => g.name).join(', ');
    }
  }

}
