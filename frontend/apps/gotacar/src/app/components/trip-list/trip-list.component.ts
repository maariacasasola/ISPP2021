import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent {
  @Input() trips;

  constructor(private _router: Router) { }

  get_profile_photo(trip) {
    return trip?.driver?.profilePhoto
      ? trip?.driver?.profilePhoto
      : 'assets/img/default-user.jpg';
  }

  see_trip_details(trip_id) {
    this._router.navigate(['/', 'trip', trip_id]);
  }
}
