import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) private data: string
  ) {}

  async continue() {
    await this._trips_service.cancel_driver_trip(this.data);
    await this._dialog_ref.close();
    await this._auth_service.set_banned(localStorage.getItem('uid'));
    this._dialog.open(ComplaintAppealDialogComponent);
  }

  close() {
    this._dialog_ref.close();
  }

  create_complaint_appeal() {
    try {
      const new_complaint_appeal = {
        content: this.complaintAppealForm.value.content || '',
      };
      this._complaint_appeals_service.create_complaint_appeal_banned(new_complaint_appeal,this.data);
      this._dialog_ref.close();
    } catch (error) {
      console.error(error);
    }
  }
}
