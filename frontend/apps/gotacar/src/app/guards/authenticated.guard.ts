import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccessForbiddenDialogComponent } from '../components/access-forbidden/access-forbidden.component';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(public router: Router, public dialog: MatDialog) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const result = localStorage.getItem('roles').includes('ROLE_CLIENT');
    if (!result) {
      this.router.navigate(['home']);
      this.dialog.open(AccessForbiddenDialogComponent);
    }
    return result;
  }
}
