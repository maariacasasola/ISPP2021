import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-no-auth-menu',
  templateUrl: './no-auth-menu.component.html',
  styleUrls: ['./no-auth-menu.component.scss'],
})
export class NoAuthMenuComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  redirect() {
    this.router.navigate(['log-in']);
  }
}
