import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverGuard implements CanActivate {
  constructor(public router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const result = localStorage.getItem('roles').includes("ROLE_DRIVER");
    if (!result) { this.router.navigate(['home']) }
    return result;
  }

}
