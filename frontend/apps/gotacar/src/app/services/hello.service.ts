import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HelloService {
  constructor(private _http_client: HttpClient) {}

  async hello(): Promise<any> {
    return this._http_client.get(environment.api_url + '/wake-up').toPromise();
  }
}
