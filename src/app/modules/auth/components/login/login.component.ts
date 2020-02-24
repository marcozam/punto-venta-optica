import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationService } from '../../../../services/application.service';
import { User } from 'models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginServive: LoginService, private applicationService: ApplicationService) { }

  ngOnInit() {}

  logIn(username: User, password: string, event:Event) {
    // let user = username
    // this.applicationService.setUser(user);
    this.loginServive.login(username, password).subscribe();
  }

  navigate() {
    
  }
}
