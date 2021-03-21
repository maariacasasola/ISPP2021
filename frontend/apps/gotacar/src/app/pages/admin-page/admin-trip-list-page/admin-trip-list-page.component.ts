import { Component } from '@angular/core';
import { trips } from "../../../trips"

@Component({
  selector: 'frontend-admin-trip-list-page',
  templateUrl: './admin-trip-list-page.component.html',
  styleUrls: ['./admin-trip-list-page.component.scss']
})
export class AdminTripListPageComponent {

  trips = trips;

}
