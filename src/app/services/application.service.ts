import { Injectable, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
// Models
import { Sucursal } from 'models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  private readonly storageNames = {
    user: 'currentUser',
    sucursal: 'currentBranch',
  };

  user: any = { C0: environment.defaultUser };
  sucursal: Sucursal;

  isUsserLogedIn: boolean; // TODO: Is it needed?

  constructor() {
    this.isUsserLogedIn = false;
    this.getStoredData('user');
    this.getStoredData('sucursal');
  }

  private storeData(name: string, value: any) {
    const storeName = this.storageNames[name];
    localStorage.setItem(storeName, JSON.stringify(value));
    this[name] = value;
  }

  private getStoredData(name: string) {
    const storeName = this.storageNames[name];
    const storeValue = localStorage.getItem(storeName);
    if (storeValue) {
      this[name] = JSON.parse(storeValue);
    }
  }

  setUser(user: any) {
    this.isUsserLogedIn = true;
    this.storeData('user', user);
  }

  setSucursal(sucursal: Sucursal) {
    this.storeData('sucursal', sucursal);
  }
}
