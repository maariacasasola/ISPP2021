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
    } catch (error) {
      console.error(error);
    }
  }

  async cancelTripOrder(id) {
    try {
      const response = await this._trips_service.cancel_trip(String(id));
      this.openSnackBar('Se ha cancelado el viaje');
      await this.load_trips_by_user();
    } catch (error) {
      if (
        error.error.message ===
        '400 BAD_REQUEST "La fecha de cancelación ha expirado"'
      ) {
        this.openSnackBar('No puedes cancelar este viaje');
      }
      console.error(error);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
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

  show_cancelation_button(trip) {
    return (
      !(trip?.status === 'REFUNDED_PENDING' || trip?.status === 'REFUNDED') &&
      new Date(trip?.trip?.cancelationDateLimit) > new Date()
    );
  }

  go_to_trip(trip_id) {
    this._router.navigate(['/', 'trip', trip_id]);
  }

  create_complaint(trip_id) {
    this._router.navigate([
      '/',
      'authenticated',
      'trips',
      trip_id,
      'create-complaint',
    ]);
  }
}
