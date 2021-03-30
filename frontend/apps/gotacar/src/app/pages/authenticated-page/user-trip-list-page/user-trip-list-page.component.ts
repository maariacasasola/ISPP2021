
import { Component } from '@angular/core';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-user-trip-list-page',
  templateUrl: './user-trip-list-page.component.html',
  styleUrls: ['./user-trip-list-page.component.scss']
})
export class UserTripListPageComponent {

  trips = [];

  constructor(private _trips_service: TripsService) {

    this.load_trips_by_user();
  }

  async load_trips_by_user() {
    try {
      this.trips = await this._trips_service.get_trips();
      console.log(this.trips);
    } catch (error) {
      console.error(error);
    }
  }

  async cancelTripOrder(id){
    try {
      await this._trips_service.cancel_trip(String(id));
    } catch (error) {
      console.error(error);
    }
  }

}