import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'frontend-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent {
  showFiller = false;

  constructor(public authService: AuthServiceService, public router: Router, private _location: Location) {
  }

  isAdmin() {
    return this.authService.is_admin();
  }

  isClient() {
    return this.authService.is_client();
  }

  isDriver() {
    return this.authService.is_driver();
  }

  isLogged() {
    return this.authService.is_logged_in();
  }

  redirect() {
    this.router.navigate(['home']);
  }

  isEdgeDomain() {
    return (this.router.url.includes('home')
      || this.router.url.includes('log-in')
      || this.router.url.includes('sign-up')
      || this.router.url.includes('google-register'));
  }

  go_back() {
    this._location.back();
  }
}
