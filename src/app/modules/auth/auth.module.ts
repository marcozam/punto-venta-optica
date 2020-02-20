import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as components from './components';
import { AuthRoutingModule } from './routing/auth.routing.module';
import { LoginService } from './services/login.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
  declarations: [
    components.LoginComponent,
  ],
  providers: [
    LoginService
  ],
})
export class AuthModule { }
