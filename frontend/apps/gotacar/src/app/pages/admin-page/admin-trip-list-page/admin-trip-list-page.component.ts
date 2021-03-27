import { Component } from '@angular/core';
import { TripsService } from '../../../services/trips.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { PenaltyDialogComponent } from '../../../components/penalty-dialog/penalty-dialog.component';
@Component({
  selector: 'frontend-admin-trip-list-page',
  templateUrl: './admin-trip-list-page.component.html',
  styleUrls: ['./admin-trip-list-page.component.scss'],
})
export class AdminTripListPageComponent {
  trips = [];

  constructor(private _trips_service: TripsService, private _my_dialog: MatDialog) {
    this.load_trips();
  }

  async load_trips() {
    try {
      this.trips = await this._trips_service.get_all_trips();
    } catch (error) {
      console.error(error);
    }
  }
  openDialog(data){
    const dialogConfig = new MatDialogConfig();
   
    console.log(data)
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this._my_dialog.open(PenaltyDialogComponent,dialogConfig);
    const dialogRef = this._my_dialog.open(PenaltyDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );    
  }
}
