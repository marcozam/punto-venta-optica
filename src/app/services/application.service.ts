import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  user: any = { C0: environment.defaultUser };
  sucursal: any;
  userId: string;
  sucursalId: string;
  isUsserLogedIn: boolean;

  constructor() {
    this.isUsserLogedIn = false
   }

  setUser(user: any) {
    // TODO: Guardar user localstorage
    this.isUsserLogedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  setSucursal() {

  }
}
