import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-authenticated-page',
  templateUrl: './authenticated-page.component.html',
  styleUrls: ['./authenticated-page.component.scss'],
})
export class AuthenticatedPageComponent {
  showFiller = false;

  constructor(public authService: AuthServiceService) { }
}
