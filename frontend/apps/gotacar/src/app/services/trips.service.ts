import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Point, Trip } from '../shared/services/trip';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  constructor(private _http_client: HttpClient) {}

  get_all_trips(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/list_trips')
      .toPromise();
  }

  async create_trip(trip: Trip) {
    const body = {
      starting_point: trip.starting_point,
      ending_point: trip.ending_point,
      price: trip.price,
      start_date: trip.start_date,
      end_date: trip.end_date,
      comments: trip.comments,
      places: trip.places,
    };

    return this._http_client
      .post(environment.api_url + '/create_trip', body)
      .toPromise();
  }

  seach_trips(
    starting_point: Point,
    ending_point: Point,
    places: number,
    date: Date
  ): Promise<any> {
    const body = {
      date: date,
      places: places,
      starting_point: starting_point,
      ending_point: ending_point,
    };

    return this._http_client
      .post(environment.api_url + '/search_trips', body)
      .toPromise();
  }
}
