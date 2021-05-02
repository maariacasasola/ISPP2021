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
      const trips = await this._trips_service.get_trips();
      trips.forEach(async (trip_order) => {
        trip_order.can_complain = await this._trips_service.is_complained(
          trip_order?.trip?.id
        );
      });
      this.trips = trips;
    } catch (error) {
      console.error(error);
    }
  }

  cancel_trip_order_dialog(trip_id, cancelationDateLimit) {
    try {
      if (new Date(cancelationDateLimit) < new Date()) {
        this.dialog.open(CancelTripPlaceDialogComponent, {
          data: {
            trip_id: [trip_id],
            afterLimit: true,
          },
          disableClose: true,
        });
      } else {
        this.dialog.open(CancelTripPlaceDialogComponent, {
          data: {
            trip_id: [trip_id],
            afterLimit: false,
          },
          disableClose: true,
        });
      }
    } catch (error) {
      console.error(error);
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
      case 'CANT_REFUND':
        return 'Devolución denegada';
      default:
        break;
    }
  }

  show_complaint_button(trip) {
    return new Date(trip.trip.startDate) < new Date() && trip.can_complain;
  }

  show_cancelation_button(trip) {
    return (
      !(trip?.status === 'REFUNDED_PENDING' || trip?.status === 'REFUNDED' || trip?.status === 'CANT_REFUND') &&
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
