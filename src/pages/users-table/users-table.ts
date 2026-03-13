import { AfterViewInit, Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { User } from '../../entities/user';
import { UsersService } from '../../services/users-service';
import { DatePipe } from '@angular/common';
import { GroupsToStringPipe } from '../../pipes/groups-to-string-pipe';
import { DialogService } from '../../services/dialog-service';
import { RouterLink } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MaterialModule } from '../../modules/material-module';
@Component({
  selector: 'app-users-table',
  imports: [MaterialModule, DatePipe, GroupsToStringPipe, RouterLink],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss',
})
export class UsersTable implements OnInit, AfterViewInit {
  users = signal<User[]>([]);
  usersService = inject(UsersService);
  dialogService = inject(DialogService);
  loggedUser = this.usersService.loggedUser;
  // columns = signal<string[]>(['id', 'name','email', 'active', 'last_login']);
  columns = computed(() => {
    if (this.loggedUser()) {
      return ['id', 'name','email', 'active', 'lastLogin', 'groups', 'permissions', 'actions'];
    } else {
      return ['id', 'name','email'];
    }
  });
  dataSource = new MatTableDataSource<User>();
  paginator = viewChild.required(MatPaginator);
  sorter = viewChild.required(MatSort);

  ngOnInit(): void {
    this.downloadUsers(); 
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sorter();
    this.dataSource.filterPredicate = (user: User, filter: string) => {
      let strings = [user.name, user.email, ''+user.active];
      strings = [...strings, ...(user.groups.map(g => g.name))];
      strings = [...strings, ...(user.groups.map(g => g.permissions).flat())];
      if (strings.map(name => name.toLocaleLowerCase())
                 .some(name => name.includes(filter))) return true;
      return false;
    }
    this.dataSource.sortingDataAccessor = (user: User, headerName: string) => {
      switch(headerName){
        case 'groups':
          return user.groups.map(g => g.name).join(' ');
        case 'name':
          return user.name;
        case 'lastLogin':
          return user.lastLogin?.toISOString() || '';
        default:
          return ''
      }
    }
  }

  downloadUsers() {
    this.usersService.getExtendedUsers().subscribe(
      (u: User[]) => {
        this.users.set(u);
        this.dataSource.data = u;
        console.log('users from server',u); 
      }
    );
  }

  deleteUser(user: User) {
    if (user.id) {
      this.dialogService.confirm(
            "Deleting user",
            "Do you really want to delete user " + user.name + "?")
          .subscribe(decision => {
        if (decision) {
          this.usersService.deleteUser(user.id!).subscribe(success =>{
            if (success) this.downloadUsers();
          });
        }
      })
    }
  }
  onFilter(event: any) {
    const filterValue = (event.target.value as string).trim().toLocaleLowerCase();
    this.dataSource.filter = filterValue;
    this.paginator().firstPage();
  }
}
