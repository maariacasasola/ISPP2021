import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'frontend-driver-profile-data-dialog',
  templateUrl: './driver-profile-data-dialog.component.html',
  styleUrls: ['./driver-profile-data-dialog.component.scss']
})
export class DriverProfileDataDialogComponent implements OnInit {
  trip;
  edad;
  constructor(@Inject(MAT_DIALOG_DATA) data,
  private _dialogRef: MatDialogRef<DriverProfileDataDialogComponent>) { 
    this.trip = data.trip;
  }

  ngOnInit(): void {
  }
  close(){
    this._dialogRef.close();
  }
  get_edad(){
    const birthdate = moment(this.trip?.driver?.birthdate);
    const years = moment().diff(birthdate, 'years');
    return years;
  }
  get_profile_photo(){
    if (this.trip?.driver?.profilePhoto) {
      return this.trip?.driver?.profilePhoto;
    }
    return 'assets/img/generic-user.jpg';
  }

}
