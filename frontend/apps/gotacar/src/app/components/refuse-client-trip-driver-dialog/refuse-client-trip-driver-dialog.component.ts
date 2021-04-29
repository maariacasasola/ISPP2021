import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'frontend-refuse-client-trip-driver-dialog',
  templateUrl: './refuse-client-trip-driver-dialog.component.html',
  styleUrls: ['./refuse-client-trip-driver-dialog.component.scss'],
})
export class RefuseClientTripDriverDialogComponent {
  constructor(
    private _dialog_ref: MatDialogRef<RefuseClientTripDriverDialogComponent>
  ) { }

  async continue() {
    this._dialog_ref.close(true);
  }

  close() {
    this._dialog_ref.close();
  }
}
