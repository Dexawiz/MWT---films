export class User {
  static clone(u: User): User {
    return new User(u.name, u.email, u.id, u.lastLogin, u.password);
  }

  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public password = '' 
  ){}

  toString() {
    return `${this.id ?? '?'}: ${this.name}, ${this.email}`; 
  }
}