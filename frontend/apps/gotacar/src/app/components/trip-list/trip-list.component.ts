import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  @Input() trips;

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  get_profile_photo(trip) {
    return trip?.driver?.profilePhoto
      ? trip?.driver?.profilePhoto
      : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  }

  see_trip_details(trip_id) {
    this._router.navigate(['/', 'trip', trip_id]);
  }
}
