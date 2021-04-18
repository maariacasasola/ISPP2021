import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripSearchResultPageComponent } from '../../pages/trip-search-result-page/trip-search-result-page.component';
import { AuthServiceService } from '../../services/auth-service.service';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'cancel-trip-dialog',
  templateUrl: './cancel-trip-dialog.component.html',
  styleUrls: ['./cancel-trip-dialog.component.scss'],
})
export class CancelTripDialogComponent {
  constructor(
    private _dialog_ref: MatDialogRef<CancelTripDialogComponent>,
    private _auth_service: AuthServiceService,
    private _trips_service: TripsService,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) {}

  async continue() {
    await this._trips_service.cancel_driver_trip(this.data);
    await this._dialog_ref.close();
    await this._auth_service.sign_out();
  }

  close() {
    this._dialog_ref.close();
  }
}
