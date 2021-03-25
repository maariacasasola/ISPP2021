
import { Component, OnInit } from '@angular/core';
import { trips } from '../../../trips'

@Component({
  selector: 'frontend-user-trip-list-page',
  templateUrl: './user-trip-list-page.component.html',
  styleUrls: ['./user-trip-list-page.component.scss']
})
export class UserTripListPageComponent implements OnInit{

  trips;
  userUID;

  ngOnInit(){
    this.trips = trips;
    this.userUID = JSON.parse(localStorage.getItem('user')).uid;
    console.log(this.userUID)
  }

}