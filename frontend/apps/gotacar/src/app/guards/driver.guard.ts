import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Router,
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
export class DriverGuard implements CanActivate {
  constructor(public router: Router, private dialog: MatDialog) { }
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
      result = localStorage.getItem('roles').includes('ROLE_DRIVER');
    }
    if (!result) {
      this.router.navigate(['home']);
      this.dialog.open(AccessForbiddenDialogComponent);
    }
    return result;
  }
}
