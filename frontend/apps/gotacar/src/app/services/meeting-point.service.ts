import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingPointService {
  constructor(private _http_client: HttpClient) {}

  get_all_meeting_points() {
    return this._http_client
      .get(environment.api_url + '/search_meeting_points')
      .toPromise();
  }
}
