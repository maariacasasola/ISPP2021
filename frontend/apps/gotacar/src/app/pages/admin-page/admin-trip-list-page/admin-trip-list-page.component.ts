import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-admin-trip-list-page',
  templateUrl: './admin-trip-list-page.component.html',
  styleUrls: ['./admin-trip-list-page.component.scss'],
})
export class AdminTripListPageComponent {
  trips = [];

  constructor(private _trips_service: TripsService, public _snackbar: MatSnackBar) {
    this.load_trips();
  }

  async load_trips() {
    try {
      this.trips = await this._trips_service.get_all_trips();
    } catch (error) {
    this._snackbar.open("Se ha producido un error al cargar los viajes", null, {
      duration: 5000});
    }
  }

  getStartDate(trip) {
    return new Date(trip.startDate);
  }
}
