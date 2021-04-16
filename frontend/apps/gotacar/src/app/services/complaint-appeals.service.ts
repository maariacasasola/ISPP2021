import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ComplaintAppeal } from '../shared/services/complaint-appeal';

@Injectable({
  providedIn: 'root',
})
export class ComplaintAppealsService {
  constructor(private _http_client: HttpClient) {}

  async create_complaint_appeal_complaint(complaint_appeal: ComplaintAppeal): Promise<any> {
    const body = {
      content: complaint_appeal.content,
    };
    return this._http_client
      .post(environment.api_url + '/complaint-appeal/complaint/create', body)
      .toPromise();
  }

  async create_complaint_appeal_banned(complaint_appeal: ComplaintAppeal, trip_id: string): Promise<any>{
    const body={
      content: complaint_appeal.content,
      tripId: trip_id,
    }
    return this._http_client
    .post(environment.api_url + '/complaint-appeal/create', body)
    .toPromise();
  }

  async get_all_complaints(): Promise<any> {
    return await this._http_client
      .get(environment.api_url + '/complaint_appeals/list')
      .toPromise();
  }

  async accept_complaint_appeal(complaint_appeal): Promise<any> {
    return await this._http_client
      .post(
        environment.api_url +
          '/complaint_appeals/' +
          complaint_appeal +
          '/accept',
        null
      )
      .toPromise();
  }

  async reject_complaint_appeal(complaint_appeal): Promise<any> {
    return await this._http_client
      .post(
        environment.api_url +
          '/complaint_appeals/' +
          complaint_appeal +
          '/reject',
        null
      )
      .toPromise();
  }
}
