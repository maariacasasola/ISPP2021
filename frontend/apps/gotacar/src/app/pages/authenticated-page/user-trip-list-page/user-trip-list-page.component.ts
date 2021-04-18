import { Component } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CancelTripPlaceDialogComponent } from '../../../components/cancel-trip-place-dialog/cancel-trip-place-dialog.component';

@Component({
  selector: 'frontend-user-trip-list-page',
  templateUrl: './user-trip-list-page.component.html',
  styleUrls: ['./user-trip-list-page.component.scss'],
})
export class UserTripListPageComponent {
  trips = [];
  filter = {
    type: null,
  };

  constructor(
    private _trips_service: TripsService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    this.load_trips_by_user();
  }

  set_type(type) {
    this.filter = { ...this.filter, type: type };
  }

  async load_trips_by_user() {
    try {
      this.trips = await this._trips_service.get_trips();
    } catch (error) {
      console.log(error);
    }
  }

  cancel_trip_order_dialog(trip_id) {
    try {
      this.dialog.open(CancelTripPlaceDialogComponent, {
        data: [trip_id],
        disableClose: true,
      });
    } catch (error) {
      console.log(error);
    }
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
      new Date(trip?.trip?.cancelationDateLimit) > new Date() &&
      new Date(trip?.trip?.startDate) > new Date()
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
