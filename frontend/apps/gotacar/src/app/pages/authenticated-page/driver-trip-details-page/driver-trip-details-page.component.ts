import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-driver-trip-details-page',
  templateUrl: './driver-trip-details-page.component.html',
  styleUrls: ['./driver-trip-details-page.component.scss']
})
export class DriverTripDetailsPageComponent {
  page_title = 'Detalles del viaje';
  trip;

  constructor(
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
    private _snackbar: MatSnackBar,
    private _auth_service: AuthServiceService,
    private _dialog: MatDialog
  ) { 
    this.load_trip();
  }

  private async load_trip() {
    try {
      this.trip = await this._trip_service.get_trip(this._route.snapshot.params['trip_id']);
    } catch (error) {
      console.error(error);
    }
  }

}
