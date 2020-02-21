import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ApplicationService } from '../../../../services/application.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginServive: LoginService, private applicationService: ApplicationService) { }

  ngOnInit() {}

  login(username:string, password:string, event:Event) {
    event.preventDefault();
    this.loginServive.login(username, password).subscribe(res => {
      let user = username;
      this.applicationService.setUser(user);
    },
    error => {
      console.log(error);
    },
    () => this.navigate()
    )
  }

  navigate() {
    
  }
}
