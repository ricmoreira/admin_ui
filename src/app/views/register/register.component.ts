import { Component, Input } from '@angular/core';
import { AuthenticationService } from './../../../services/authentication.service'
import { Register } from './../../../models/request/authentication'
import { Token, UserRegister } from './../../../models/response/authentication'

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {
  @Input() registerRequest: Register;

  public showSuccessMessage: boolean
  public successMessage: string

  constructor(private service: AuthenticationService) {
    this.registerRequest = new Register();
    this.showSuccessMessage = false;
  }

  register() {
    this.service.register(this.registerRequest)
      .subscribe(
        (response) => {
          console.log(response);
          this.successMessage = `User registered with success!`
          this.toggleShowMessage();
        },
        error => {
          console.log(error);
        });
  }

  toggleShowMessage() {
    this.showSuccessMessage = !this.showSuccessMessage;
    setTimeout(() => {
      this.showSuccessMessage = !this.showSuccessMessage;
    }, 3000);
  }
}
