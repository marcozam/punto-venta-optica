import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationService } from 'app/services';
import { User } from 'models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private loginServive: LoginService, private applicationService: ApplicationService) { }

  logIn(username: User, password: string) {
    this.loginServive.login(username, password).subscribe(user => {
      this.applicationService.setUser(user);
    });
  }
}
