import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'frontend-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  app_title="GotACar"

  constructor() { }

  ngOnInit(): void {
  }

}
