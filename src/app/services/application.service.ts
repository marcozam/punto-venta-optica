import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class ApplicationService {

  user: any = { C0: environment.defaultUser };
  sucursal: any;
  userId: string;
  sucursalId: string;

  constructor() { }

  setUser(user: any) {
    // TODO: Guardar user localstorage
  }

  setSucursal() {

  }
}
