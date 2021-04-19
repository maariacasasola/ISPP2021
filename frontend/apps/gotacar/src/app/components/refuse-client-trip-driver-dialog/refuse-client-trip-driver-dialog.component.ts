import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'frontend-refuse-client-trip-driver-dialog',
  templateUrl: './refuse-client-trip-driver-dialog.component.html',
  styleUrls: ['./refuse-client-trip-driver-dialog.component.scss'],
})
export class RefuseClientTripDriverDialogComponent {
  constructor(
    private _dialog_ref: MatDialogRef<RefuseClientTripDriverDialogComponent>
  ) {}

  async continue() {
    this._dialog_ref.close(true);
  }

  close() {
    this._dialog_ref.close();
  }
}
