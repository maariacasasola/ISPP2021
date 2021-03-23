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
  constructor(public authService: AuthServiceService, public router: Router) { 
    this.isLogged = this.authService.is_logged_in();
    this.isAdmin = this.authService.is_admin();
    this.isClient = this.authService.is_client();
    this.isDriver = this.authService.is_driver();
  }
  isAdmin;
  isClient;
  isDriver;
  isLogged;

  ngOnInit(): void {
    
  }

  redirect() {
    this.router.navigate(['home']);
  }
}
