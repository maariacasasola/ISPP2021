import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-user-trip-details-page',
  templateUrl: './user-trip-details-page.component.html',
  styleUrls: ['./user-trip-details-page.component.scss']
})
export class UserTripDetailsPageComponent implements OnInit {
  trip;
  tripOrders = [];
  userUID;

  constructor(
    private route: ActivatedRoute,
    private _trips_service: TripsService,
  ) {
  
  }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const tripIdFromRoute = routeParams.get('tripId');

    this.trip = this.tripOrders.find(t => t.id === tripIdFromRoute);

  }



  async load_trips_by_user() {
    try {
      this.tripOrders = await this._trips_service.get_trips();
    } catch (error) {
      console.error(error);
    }
  }

}
