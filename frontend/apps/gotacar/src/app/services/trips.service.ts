import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

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
}
