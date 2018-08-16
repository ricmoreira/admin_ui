import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service'
import { Login } from '../../../models/request/authentication'
import { User } from '../../../models/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  @Input() loginRequest: Login;

  returnUrl: string;

  constructor(private service: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute) {

    this.loginRequest = new Login();
  }

  ngOnInit() {
    // reset login status
    this.service.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login() {
    this.service.login(this.loginRequest)
      .subscribe(
        (user: User) => {
          this.router.navigateByUrl(this.returnUrl);
          console.log("Welcome " + user.username + " to ADMIN UI");
        },
        error => {
          console.log(error);
        });
  }
}
