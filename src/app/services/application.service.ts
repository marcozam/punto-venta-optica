import { Injectable, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
// Models
import { Sucursal, User } from 'models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  private readonly storageNames = {
    user: 'currentUser',
    sucursal: 'currentBranch',
  };

  user: User;
  sucursal: Sucursal;

  constructor() {
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

  setUser(user: User) {
    this.storeData('user', user);
  }

  setSucursal(sucursal: Sucursal) {
    this.storeData('sucursal', sucursal);
  }
}
