import { Component } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-user-trip-list-page',
  templateUrl: './user-trip-list-page.component.html',
  styleUrls: ['./user-trip-list-page.component.scss'],
})
export class UserTripListPageComponent {
  trips = [];

  constructor(
    private _trips_service: TripsService,
    private _snackBar: MatSnackBar,
    private _router: Router
  ) {
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

  async cancelTripOrder(id) {
    try {
      await this._trips_service.cancel_trip(String(id));
      this.openSnackBar('Se ha cancelado el viaje', 'Cerrar');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['blue-snackbar'],
    });
  }

  get_trip_status(status) {
    switch (status) {
      case 'PROCCESSING':
        return 'Procesando pago';
      case 'REFUNDED_PENDING':
        return 'Devolución pendiente';
      case 'REFUNDED':
        return 'Devolución completada';
      case 'PAID':
        return 'Pago realizado';
      default:
        break;
    }
  }

  show_complaint_button(trip) {
    return new Date(trip.startDate) < new Date();
  }

  go_to_trip(trip_id) {
    this._router.navigate(['/', 'trip', trip_id]);
  }

  create_complaint(trip_id) {
    this._router.navigate(['/', 'authenticated', 'trips', trip_id, 'create-complaint']);
  }
}
