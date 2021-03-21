import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.scss'],
})
export class LogInPageComponent implements OnInit {
  constructor(public authService: AuthServiceService) {}

  ngOnInit(): void {}
}
