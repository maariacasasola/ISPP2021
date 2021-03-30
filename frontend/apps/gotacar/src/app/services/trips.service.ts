import { HttpClient, HttpParams } from '@angular/common/http';
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

  get_trips(): Promise<any> {

    return this._http_client
      .get(environment.api_url + '/list_trip_orders')
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

  cancel_trip(id: string){
    let params = new HttpParams();
    params = params.set('id', id);
    console.log(environment.api_url + '/cancel_trip_order_request/'+id);
    return this._http_client.post(environment.api_url + '/cancel_trip_order_request/'+id, null);
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

    console.log(body)

    return this._http_client
      .post(environment.api_url + '/search_trips', body)
      .toPromise();
  }
}
