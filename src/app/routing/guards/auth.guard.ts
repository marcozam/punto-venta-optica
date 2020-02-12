import { Injectable } from '@angular/core';
import {
  UrlSegment,
  CanLoad,
  Router,
  Route,
} from '@angular/router';
// RxJs
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanLoad {

  constructor(private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const authenticated = false;
    if (!authenticated) {
      this.router.navigate(['auth/login']);
    }
    return of(authenticated);
  }
}
