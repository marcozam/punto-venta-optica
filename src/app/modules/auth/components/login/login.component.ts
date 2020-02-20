import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginServive: LoginService) { }

  ngOnInit() {
    this.loginServive.login('V8', 'V9').subscribe(
      res => {console.log(res)
    });
  }

  login(username:string, password:string, event:Event) {
    event.preventDefault();
    this.loginServive.login(username, password).subscribe(
      error => { console.error(error);},
      () => this.navigate());
  }
  navigate() {
    
  }
}
