import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'frontend-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  app_title="Gotacar"

  constructor() { }

  ngOnInit(): void {
  }

}
