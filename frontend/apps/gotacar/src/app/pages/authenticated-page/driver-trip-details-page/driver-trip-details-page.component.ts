import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RatingUserDialogComponent } from '../../../components/rating-user-dialog/rating-user-dialog.component';
import { TripsService } from '../../../services/trips.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'frontend-driver-trip-details-page',
  templateUrl: './driver-trip-details-page.component.html',
  styleUrls: ['./driver-trip-details-page.component.scss'],
})
export class DriverTripDetailsPageComponent {
  page_title = 'Detalles del viaje';
  trip;
  users;

  constructor(
    private _snackBar: MatSnackBar,
    private _user_service: UsersService,
    private _my_dialog: MatDialog,
    private _route: ActivatedRoute,
    private _trip_service: TripsService
  ) {
    this.load_trip();
    this.load_users();
  }

  private async load_trip() {
    try {
      this.trip = await this._trip_service.get_trip(
        this._route.snapshot.params['trip_id']
      );
    } catch (error) {
      console.error(error);
    }
  }

  private async load_users() {
    try {
      this.users = await this._trip_service.get_users_by_trip(
        this._route.snapshot.params['trip_id']
      );
    } catch (error) {
      console.error(error);
    }
  }

  get_user_profile_photo(user) {
    return user?.profilePhoto || 'assets/img/generic-user.jpg';
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
  async addValoracionDialog(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
      to: id,
    };

    const dialogRef = this._my_dialog.open(
      RatingUserDialogComponent,
      dialogConfig
    );

    const dialog_response = await dialogRef.afterClosed().toPromise();

    if (dialog_response) {
      try {
        const response = await this._user_service.rate_user(dialog_response);
        if (response) {
          this.openSnackBar('Tu valoración ha sido exitosa');
          await this.load_users();
        }
      } catch (error) {
        this.openSnackBar('Tu valoración no se ha podido realizar');
      }
    }
  }
}
