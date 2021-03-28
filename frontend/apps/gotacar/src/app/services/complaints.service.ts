import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Complaint } from '../shared/services/complaint';
import { ComplaintAppeal } from '../shared/services/complaint-appeal';

@Injectable({
  providedIn: 'root',
})
export class ComplaintsService {
  constructor(private _http_client: HttpClient) { }

  get_all_complaints(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/complaints/list')
      .toPromise();
  }

  async create_complaint(complaint: Complaint) {
    const body = {
      title: complaint.title,
      content: complaint.content,
      tripId: complaint.tripId.toString(),
    }
    return this._http_client.post(environment.api_url + '/complaints/create', body).toPromise();
  }

  async create_complaint_appeal(complaint_appeal: ComplaintAppeal) {
    const body = {
      content: complaint_appeal.content,
      checked: complaint_appeal.checked,
    }
    return this._http_client.post(environment.api_url + '/complaint_appeal', body).toPromise();
  }
}
