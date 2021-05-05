import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.scss'],
})
export class LogInPageComponent {
  app_title = 'Log In';
  constructor(
    public authService: AuthServiceService,
    private _router: Router
  ) { }

  register() {
    this._router.navigate(['/', 'sign-up']);
  }
}
