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

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(public router: Router, public dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(DialogElementsForbiddenDialog);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      const result = localStorage.getItem('roles').includes("ROLE_ADMIN");
      if(!result){ this.router.navigate(['home'])}
      this.openDialog()
    return result;
  }
}

@Component({
  selector: 'dialog-elements-forbidden-dialog',
  templateUrl: 'dialog-elements-forbidden-dialog.html',
})
export class DialogElementsForbiddenDialog {}