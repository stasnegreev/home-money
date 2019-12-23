import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { User } from '../models/user.model';
import {BaseApi} from '../core/base-api';


@Injectable()
export class UsersService extends BaseApi{
  constructor(
    public http: HttpClient,
  ) {
    super(http);
  }
  getUserByEmail(email: string): Observable<User[]> {
    return this.get(`users?email=${email}`);
  }
  //getUserByEmail(email: string): Observable<User> {
  //  return this.http.get(`http://localhost:3000/users?email=${email}`, {responseType: 'json'}).pipes(
  //    map(
  //     (user) => user[0] ? user[0] : undefined
  //    )
  // );
  //}

  createNewUser(user: User): Observable<User> {
    return this.post('users', user);
  }
  //createNewUser(user: User): Observable<User> {
  //  console.log('i in creat new user fun',user);
  //  return this.http.post('http://localhost:3000/users', user).pipes(
  // http://localhost:3000/users
  //    map(
  //      (user: User) => user
  //    )
  //  );
  //}
}

