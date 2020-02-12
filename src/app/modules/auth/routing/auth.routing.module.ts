import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import * as components from '../components';

const authRoutes: Routes = [
  {
    path: 'login',
    component: components.LoginComponent,
    data: { title: 'Iniciar Session' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule,
  ]
})
export class AuthRoutingModule { }
