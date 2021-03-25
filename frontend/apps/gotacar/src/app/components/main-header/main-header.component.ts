import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent {
  showFiller = false;

  constructor(public authService: AuthServiceService, public router: Router) {}

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
}
