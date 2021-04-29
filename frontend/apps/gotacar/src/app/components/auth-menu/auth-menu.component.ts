import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-auth-menu',
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.scss'],
})
export class AuthMenuComponent {
  constructor(public authService: AuthServiceService) {}
  
  user_is_banned() {
    return this.authService.user_is_banned();
  }
}
