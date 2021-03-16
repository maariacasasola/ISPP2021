import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'frontend-authenticated-page',
  templateUrl: './authenticated-page.component.html',
  styleUrls: ['./authenticated-page.component.scss'],
})
export class AuthenticatedPageComponent implements OnInit {
  showFiller = false;

  constructor() {}

  ngOnInit(): void {}
}
