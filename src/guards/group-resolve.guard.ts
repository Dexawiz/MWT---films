import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Group } from "../entities/group";
import { EMPTY, Observable } from "rxjs";
import { inject } from "@angular/core";
import { UsersService } from "../services/users-service";

export const groupResolveGuard: ResolveFn<Group> = 
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> => {
    const usersService = inject(UsersService);
    const id = route.paramMap.get('id')
    console.log('resolver of group for id', id);
    if (id == null) return EMPTY;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) return EMPTY;
    return usersService.getGroup(idNum);
  }