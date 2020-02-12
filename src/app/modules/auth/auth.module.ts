import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as components from './components';
import { AuthRoutingModule } from './routing/auth.routing.module';

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
  ],
})
export class AuthModule { }
