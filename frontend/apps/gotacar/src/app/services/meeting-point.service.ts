import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MeetingPoint } from '../shared/services/meeting-point';

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
  async post_meeting_point(meetingPoint: MeetingPoint){
    const body = {
      name:meetingPoint.name,
      address:meetingPoint.address,
      lat:meetingPoint.lat,
      lng:meetingPoint.lng,
    }
    return this._http_client
    .post(environment.api_url + '/create_meeting_point',body).toPromise()
    
  }
}
