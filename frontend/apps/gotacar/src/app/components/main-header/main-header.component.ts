import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
  @Input() title;
  showFiller = false;
  constructor(public authService: AuthServiceService, public router: Router) { }
  isLogged;

  ngOnInit(): void {
    this.isLogged = this.authService.is_logged_in();
  }

  redirect() {
    this.router.navigate(['home']);
  }
}
