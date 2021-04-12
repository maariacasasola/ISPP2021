import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.scss'],
})
export class LogInPageComponent implements OnInit {
  app_title = 'Log In';
  constructor(
    public authService: AuthServiceService,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  register() {
    this._router.navigate(['/', 'sign-up']);
  }
}
