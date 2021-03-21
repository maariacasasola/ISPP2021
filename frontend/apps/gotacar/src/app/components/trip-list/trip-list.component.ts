import { Component } from '@angular/core';
import { trips } from "../../trips"

@Component({
  selector: 'frontend-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent{

  trips = trips;

  


}
