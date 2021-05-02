import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthServiceService } from '../../services/auth-service.service';
import { ComplaintAppealsService } from '../../services/complaint-appeals.service';
import { TripsService } from '../../services/trips.service';
import { ComplaintAppealDialogComponent } from '../complaint-appeal-dialog/complaint-appeal-dialog.component';

@Component({
  selector: 'cancel-trip-dialog',
  templateUrl: './cancel-trip-dialog.component.html',
  styleUrls: ['./cancel-trip-dialog.component.scss'],
})
export class CancelTripDialogComponent {

  complaintAppealForm: FormGroup = new FormGroup({
    content: new FormControl(''),
  });

  constructor(
    private _dialog_ref: MatDialogRef<CancelTripDialogComponent>,
    private _auth_service: AuthServiceService,
    private _trips_service: TripsService,
    private _complaint_appeals_service: ComplaintAppealsService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) { }

  async continue() {
    try {
      await this._trips_service.cancel_driver_trip(this.data);
      await this._dialog_ref.close(true);
      let close = Promise.resolve(this._dialog_ref.close(true));
      await close;
      await this._auth_service.set_banned(localStorage.getItem('uid'));
      if (await this._complaint_appeals_service.can_complaint_appeal()) {
        this._dialog.open(ComplaintAppealDialogComponent, {
          data: { tripId: this.data }
        });
      } else {
        this.openSnackBar("La cuenta ha sido baneada");
      }
    } catch (error) {
      this.openSnackBar("Ha ocurrido un error");
    }
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
