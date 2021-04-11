import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-driver-trip-details-page',
  templateUrl: './driver-trip-details-page.component.html',
  styleUrls: ['./driver-trip-details-page.component.scss']
})
export class DriverTripDetailsPageComponent {
  page_title = 'Detalles del viaje';
  trip;
  users;

  constructor(
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
  ) { 
    this.load_trip();
    this.load_users();
  }

  private async load_trip() {
    try {
      this.trip = await this._trip_service.get_trip(this._route.snapshot.params['trip_id']);
    } catch (error) {
      console.error(error);
    }
  }

  private async load_users(){
    try{
      this.users = await this._trip_service.get_users_by_trip(this._route.snapshot.params['trip_id']);
      console.log(this.users);
    }catch(error){
      console.log(error);
    }
  }


}