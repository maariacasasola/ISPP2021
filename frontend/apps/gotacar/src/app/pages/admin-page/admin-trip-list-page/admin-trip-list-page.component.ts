import { Component } from '@angular/core';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-admin-trip-list-page',
  templateUrl: './admin-trip-list-page.component.html',
  styleUrls: ['./admin-trip-list-page.component.scss'],
})
export class AdminTripListPageComponent {
  trips = [];

  constructor(private _trips_service: TripsService) {
    this.load_trips();
  }

  async load_trips() {
    try {
      this.trips = await this._trips_service.get_all_trips();
    } catch (error) {
      console.error(error);
    }
  }

  getStartDate(trip) {
    return new Date(trip.startDate);
  }
}
