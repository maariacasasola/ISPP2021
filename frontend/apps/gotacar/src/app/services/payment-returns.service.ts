import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentReturnsService {
  constructor(private _http_client: HttpClient) {}

  async get_all_payment_returns(): Promise<any> {
    return await this._http_client
      .get(environment.api_url + '/payment-return/list')
      .toPromise();
  }
}
