import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _http_client: HttpClient) { }

  get_all_users(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/enrolled-user/list')
      .toPromise();
  }

  delete_penalized_account(user_id: string): Promise<any> {
    return this._http_client
      .post(environment.api_url + '/delete-penalized-account/' + user_id, null)
      .toPromise();
  }

  delete_account(): Promise<any> {
    return this._http_client
      .post(environment.api_url + '/delete-account', null)
      .toPromise();
  }

  update_profile_photo(photo_url) {
    return this._http_client
      .post(environment.api_url + '/user/update/profile-photo', {
        profilePhoto: photo_url,
      })
      .toPromise();
  }

  convert_to_driver(uid: string): Promise<any> {
    const uid_json = {
      uid: uid,
    };
    return this._http_client
      .post(environment.api_url + '/driver/accept', uid_json)
      .toPromise();
  }

  cancel_driver_request(uid: string): Promise<any> {
    const uid_json = {
      uid: uid
    }
    return this._http_client.post(environment.api_url + '/driver/cancel', uid_json).toPromise();
  }

  get_all_driver_requests(): Promise<any> {
    return this._http_client
      .get(environment.api_url + '/driver-request/list')
      .toPromise();
  }
  request_conversion_to_driver(user_data) {
    return this._http_client
      .post(environment.api_url + '/driver/create', user_data)
      .toPromise();
  }

  rate_user(data) {
    return this._http_client
      .post(environment.api_url + '/rate', data)
      .toPromise();
  }
  check_users_rated(data) {
    return this._http_client
      .post(environment.api_url + '/rate/check', data)
      .toPromise();
  }
  async get_ratings_by_userid(idUser: string): Promise<any> {
    return this._http_client.get(environment.api_url + '/ratings/' + idUser).toPromise();

  }
}
