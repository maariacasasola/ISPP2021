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

  get_all_trip_orders(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/trip_order/list')
      .toPromise();
  }

  get_trip_order(trip_order_id: string): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/trip_order/show/' + trip_order_id)
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

  cancel_trip_order(trip_order_id) {
    return this._http_client
      .post(
        environment.api_url + '/trip-order/' + trip_order_id + '/cancel',
        null
      )
      .toPromise();
  }

  async seach_trips(
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

  async get_trip(trip_id: string): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/trip/' + trip_id)
      .toPromise();
  }

  async get_users_by_trip(trip_id: string): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/list_users_trip/' + trip_id)
      .toPromise();
  }

  async create_stripe_session(trip_id, quantity, description): Promise<any> {
    const body = {
      quantity: quantity,
      description: description,
      idTrip: trip_id,
    };
    return this._http_client
      .post(environment.api_url + '/create_session', body)
      .toPromise();
  }

  get_driver_trips(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/list_trips_driver')
      .toPromise();
  }

  cancel_driver_trip(trip_id: string) {
    return this._http_client
      .post(environment.api_url + '/cancel_trip_driver/' + trip_id, null)
      .toPromise();
  }

  cancel_trip(id: string) {
    return this._http_client
      .post(environment.api_url + '/cancel_trip_order_request/' + id, null)
      .toPromise();
  }

  async is_complained(trip_id: string): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/complaints/check/' + trip_id)
      .toPromise();
  }
}
