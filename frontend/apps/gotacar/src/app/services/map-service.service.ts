import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  baseUrl = ''
  headers = new HttpHeaders({
    'Content-Type':'',
    Authorization: '',

  });

  constructor(private httpClient: HttpClient) { }
}
