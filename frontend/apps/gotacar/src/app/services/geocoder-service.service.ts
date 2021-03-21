import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeocoderServiceService {
  constructor(private _http_client: HttpClient) {}

  async get_location_from_address(address): Promise<any> {
    const api_url =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      address +
      '&region=es&key=' +
      environment.geocoding_api_key;
    return this._http_client.get(api_url).toPromise();
  }
}
