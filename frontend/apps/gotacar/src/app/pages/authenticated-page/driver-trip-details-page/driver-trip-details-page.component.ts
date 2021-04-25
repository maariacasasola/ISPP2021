import { JsonpClientBackend } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingUserDialogComponent } from '../../../components/rating-user-dialog/rating-user-dialog.component';
import * as moment from 'moment';
import { RefuseClientTripDriverDialogComponent } from '../../../components/refuse-client-trip-driver-dialog/refuse-client-trip-driver-dialog.component';
import { TripsService } from '../../../services/trips.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'frontend-driver-trip-details-page',
  templateUrl: './driver-trip-details-page.component.html',
  styleUrls: ['./driver-trip-details-page.component.scss'],
})
export class DriverTripDetailsPageComponent {
  today = new Date();
  fecha;
  page_title = 'Detalles del viaje';
  trip;
  users_already_rated;

  constructor(
    private _snackBar: MatSnackBar,
    private _user_service: UsersService,
    private _my_dialog: MatDialog,
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
    private dialog: MatDialog,
    private _router: Router,
  ) {
    this.load_trip();
  }

  private async load_trip() {
    try {
      this.trip = await this._trip_service.get_trip(
        this._route.snapshot.params['trip_id']
      );
      this.get_users_rated();
      this.fecha = new Date(this.trip.startDate);
    } catch (error) {
      this.openSnackBar("Se ha producido un error al cargar el viaje");
    }
  }

  async get_users_rated() {
    const usersS = await this._trip_service.get_users_by_trip(
      this._route.snapshot.params['trip_id']
    );
    let idUsers = '';
    for (let user of usersS) {
      idUsers = idUsers + user.id + ',';
    }
    const data = {
      id_users: idUsers,
      trip_id: this.trip.id,
    };

    try {
      const response = await this._user_service.check_users_rated(data);
      if (response) {
        this.users_already_rated = response;
      }
    } catch (error) {
      this.openSnackBar('Problema al cargar los usuarios valorados');
    }
  }

  get_user_profile_photo(user) {
    return user?.profilePhoto || 'assets/img/generic-user.jpg';
  }
  go_to_user_ratings(user_id) {
    this._router.navigate(['/', 'authenticated', 'user-ratings', user_id]);
  }

  async addValoracionDialog(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
      to: id,
      trip_id: this._route.snapshot.params['trip_id'],
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
          await this.load_trip();
          await this.get_users_rated();
        }
      } catch (error) {
        this.openSnackBar('Tu valoración no se ha podido realizar');
      }
    }
  }

  async active_cancel_dialog(trip_order_id) {
    try {
      const confirm_dialog = this.dialog.open(
        RefuseClientTripDriverDialogComponent
      );

      const response = await confirm_dialog.afterClosed().toPromise();
      if (response) {
        const api_response = await this._trip_service.cancel_trip_order(
          trip_order_id
        );
        if (api_response) {
          this.openSnackBar('Cliente rechazado correctamente');
          await this.load_trip();
        }
      }
    } catch (error) {
      this.openSnackBar('Ha ocurrido un error, inténtelo más tarde');
      console.error(error);
    }
  }

  checkDate(cancelationDate) {
    return moment(cancelationDate).isAfter(moment());
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
