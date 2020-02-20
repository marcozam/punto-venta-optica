import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  user: any = { C0: environment.defaultUser };
  sucursal: any;
  userId: string;
  sucursalId: string;

  constructor(private isUsserLogedIn: boolean) { }

  setUser(user: any) {
    // TODO: Guardar user localstorage
    this.isUsserLogedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  setSucursal() {

  }
}
