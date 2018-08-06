import { Component, Input } from '@angular/core';
import { AuthenticationService } from './../../../services/authentication.service'
import { Login } from './../../../models/request/authentication'
import { Token } from './../../../models/response/authentication'
import { User } from '../../../models/user';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  @Input() loginRequest: Login;

  constructor(private service: AuthenticationService, private router: Router) {
    this.loginRequest = new Login();
  }

  login() {
    this.service.login(this.loginRequest)
      .pipe(
        map((token: Token) => {
          return token.token;
        }),
        switchMap((token: string) => {
          return this.service.setUserFromJWT(token);
        }),
      ).subscribe(
        (user: User) => {
          this.router.navigate(['/dashboard']);
          console.log(user);
        },
        error => {
          console.log("error:", error);
        });
  }
}
