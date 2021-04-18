import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { RefuseClientTripDriverDialogComponent } from
 '../../../components/refuse-client-trip-driver-dialog/refuse-client-trip-driver-dialog.component';
import { TripsService } from '../../../services/trips.service';

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
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
    private dialog: MatDialog,
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

  active_cancel_dialog(trip_id, user_id) {
    try {
      this.dialog.open(RefuseClientTripDriverDialogComponent, {
        data: [trip_id, user_id],
        disableClose: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  checkDate(endingDate) {
    return moment(endingDate).isAfter(moment());
  }

}

