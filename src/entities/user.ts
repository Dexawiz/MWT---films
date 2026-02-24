import { Group } from "./group";

export class User {
  static clone(u: User): User {
    return new User(u.name, u.email, u.id, u.lastLogin, u.password, u.active, u.groups?.map(g => Group.clone(g)));
  }

  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public password = '',
    public active = true,
    public groups: Group[] = [] 
  ){}

  toString() {
    return `${this.id ?? '?'}: ${this.name}, ${this.email}`; 
  }
}