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
  message;
  constructor(
    private _dialog_ref: MatDialogRef<CancelTripPlaceDialogComponent>,
    private _trips_service: TripsService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.get_message();
  }

  get_message() {
    if (!this.data.afterLimit) {
      this.message = "Va a proceder a rechazar su plaza en este viaje. \n Se procederá a devolverle el importe."
    } else {
      this.message = "Va a proceder a rechazar su plaza en este viaje después del límite de cancelación. \n Tenga en cuenta que no se le devolverá el importe de la misma."
    }
  }

  async continue() {
    try {
      const response = await this._trips_service.cancel_trip(this.data.trip_id);
      if (response) {
        this.openSnackBar('Se ha cancelado el viaje');
      }
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
