import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'frontend-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
  @Input() title;
  showFiller = false;
  constructor(public authService: AuthServiceService) {}

  ngOnInit(): void {}
}
