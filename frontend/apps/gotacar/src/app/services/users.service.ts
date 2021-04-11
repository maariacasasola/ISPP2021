import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../shared/services/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _http_client: HttpClient) {}

  get_all_users(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/enrolled-user/list')
      .toPromise();
  }
}
