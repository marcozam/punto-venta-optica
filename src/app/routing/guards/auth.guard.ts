import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { ApplicationService } from 'app/services';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private applicationService: ApplicationService, private router: Router) {}

  canLoad(): boolean {
    const loggedIn = !!this.applicationService.user;
    if (!loggedIn) {
      this.router.navigateByUrl('auth/login');
    }
    return loggedIn;
  }
}
