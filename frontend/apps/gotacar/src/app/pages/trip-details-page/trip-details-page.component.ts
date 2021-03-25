import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'frontend-trip-details-page',
  templateUrl: './trip-details-page.component.html',
  styleUrls: ['./trip-details-page.component.scss']
})
export class TripDetailsPageComponent implements OnInit {

  page_title="GotACar"

  constructor() { }

  ngOnInit(): void {
  }

}
