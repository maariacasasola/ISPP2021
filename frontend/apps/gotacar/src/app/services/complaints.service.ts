import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ComplaintAppeal } from '../shared/services/complaint-appeal';
import { Trip } from '../shared/services/trip'

@Injectable({
    providedIn: 'root',
})
export class ComplaintsService {
    constructor(private _http_client: HttpClient) { }

    async create_complaint_appeal(complaint_appeal: ComplaintAppeal) {
        const body = {
            complaint: complaint_appeal.complaint,
            content: complaint_appeal.content,
            checked: false,
        }

        return this._http_client.post(environment.api_url + '/complaint-appeal', body).toPromise()
    }
}