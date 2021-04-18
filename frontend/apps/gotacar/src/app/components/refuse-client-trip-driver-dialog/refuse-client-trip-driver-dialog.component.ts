import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'frontend-refuse-client-trip-driver-dialog',
  templateUrl: './refuse-client-trip-driver-dialog.component.html',
  styleUrls: ['./refuse-client-trip-driver-dialog.component.scss']
})
export class RefuseClientTripDriverDialogComponent {

  constructor(
    private _dialog_ref: MatDialogRef<RefuseClientTripDriverDialogComponent>,
    private _trips_service: TripsService,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) { }

  async continue() {
    await this._trips_service.cancel_user_from_trip(this.data);
    this._dialog_ref.close();
    window.location.reload();
  }

  close() {
    this._dialog_ref.close();
    
  }

}