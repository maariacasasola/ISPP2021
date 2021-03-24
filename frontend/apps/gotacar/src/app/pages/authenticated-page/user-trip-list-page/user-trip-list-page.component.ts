import { Component } from '@angular/core';
import { trips } from "../../../trips"

@Component({
  selector: 'frontend-user-trip-list-page',
  templateUrl: './user-trip-list-page.component.html',
  styleUrls: ['./user-trip-list-page.component.scss']
})
export class UserTripListPageComponent{

  trips = trips;

}
