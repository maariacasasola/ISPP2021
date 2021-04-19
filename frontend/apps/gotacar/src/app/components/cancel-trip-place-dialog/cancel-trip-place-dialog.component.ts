import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'frontend-cancel-trip-place-dialog',
  templateUrl: './cancel-trip-place-dialog.component.html',
  styleUrls: ['./cancel-trip-place-dialog.component.scss']
})
export class CancelTripPlaceDialogComponent {

  constructor(
    private _dialog_ref: MatDialogRef<CancelTripPlaceDialogComponent>,
    private _trips_service: TripsService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) { }

  async continue() {
    try {
      const response = await this._trips_service.cancel_trip(this.data);
      this.openSnackBar('Se ha cancelado el viaje');
    } catch (error) {
      if (
        error.error.message ===
        '400 BAD_REQUEST "La fecha de cancelación ha expirado"'
      ) {
        this.openSnackBar('No puedes cancelar este viaje');
      }
      console.error(error);
    }
    this._dialog_ref.close();
    window.location.reload();
  }

  close() {
    this._dialog_ref.close();
    
  }


  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 5000,
      panelClass: ['blue-snackbar'],
    });
  }
}
