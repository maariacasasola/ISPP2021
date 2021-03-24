import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
//import {DialogElementsForbiddenDialog} from '../components/access-forbidden/access-forbidden.component';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccessForbiddenDialogComponent } from '../components/access-forbidden/access-forbidden.component';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(public router: Router, public dialog: MatDialog) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let result = false;
    if (localStorage.getItem('roles')) {
      result = localStorage.getItem('roles').includes('ROLE_ADMIN');
    }
    if (!result) {
      this.router.navigate(['home']);
      this.dialog.open(AccessForbiddenDialogComponent);
    }
    return result;
  }
}
