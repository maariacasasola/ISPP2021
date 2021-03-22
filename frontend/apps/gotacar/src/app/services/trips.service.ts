import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Trip } from '../shared/services/trip'

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  constructor(private _http_client: HttpClient) { }

  get_all_trips(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/list_trips')
      .toPromise();
  }

  async create_trip(trip: Trip) {
    const body = {
      starting_point: trip.starting_point,
      endingPoint: trip.endingPoint,
      price: trip.price,
      startDate: trip.startDate,
      endingDate: trip.endingDate,
      cancelationDate: trip.cancelationDate,
      comment: trip.comment,
      places: trip.places,
      canceled: trip.canceled,
    }
    return this._http_client
      .post(environment.api_url + '/create_trip', body).toPromise()

  }

}
