import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-authenticated-page',
  templateUrl: './authenticated-page.component.html',
  styleUrls: ['./authenticated-page.component.scss'],
})
export class AuthenticatedPageComponent implements OnInit {
  showFiller = false;

  constructor(public authService: AuthServiceService) {}

  ngOnInit(): void {}
}
