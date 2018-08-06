import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Login, Register } from './../models/request/authentication';
import { Token, UserRegister } from './../models/response/authentication';
import { Configs } from './../assets/config';
import * as jwt_decode from "jwt-decode";
import { User } from '../models/user';
import { Router } from "@angular/router";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticationService {

  private _loginUrl: string;
  private _registerUrl: string;

  private _user: User;

  private _httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private router: Router) {
    this._loginUrl = Configs.authentication_base_url + Configs.authentication_login;
    this._registerUrl = Configs.authentication_base_url + Configs.authentication_register;
  }

  /**
   * Obtains a JWT token from login service
   * @param req - Login request
   */
  login(req: Login): Observable<Token> {
    return this.http.post<Token>(this._loginUrl, req, this._httpOptions)
  }

  /**
  * Registers a user and logs the user if success
  * @param req - Login request
  */
  register(req: Register): Observable<UserRegister> {
    return this.http.post<UserRegister>(this._registerUrl, req, this._httpOptions)
  }

  /**
   * Returns the User with its session data
   */
  getUser(): User {
    return this._user;
  }

  setUserFromJWT(jwt: string): Observable<User> {
    return Observable.create((observer) => {
      try {
        let tokenData = jwt_decode(jwt);

        this._user = new User();
        this._user.email = tokenData.email;
        this._user.username = tokenData.username;
        this._user.roles = tokenData.roles.slice();
        this._user.sessionTimeout = tokenData.exp;
        this._user.jwt = jwt; // for using in API services requests
        observer.next(this._user);
      } catch (error) {
        this._user = new User();
        observer.error(error);
      }
    });
  }
}