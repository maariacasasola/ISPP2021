import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-no-auth-menu',
  templateUrl: './no-auth-menu.component.html',
  styleUrls: ['./no-auth-menu.component.scss'],
})
export class NoAuthMenuComponent {
  constructor(public router: Router) { }

  redirect() {
    this.router.navigate(['log-in']);
  }
  gotoSignup() {
    this.router.navigate(['sign-up'])
  }
}
