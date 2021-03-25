import { Component, OnInit } from '@angular/core';
import { trips } from '../../../trips';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'frontend-user-trip-details-page',
  templateUrl: './user-trip-details-page.component.html',
  styleUrls: ['./user-trip-details-page.component.css']
})
export class UserTripDetailsPageComponent implements OnInit {
  trip;
  user = JSON.parse(localStorage.getItem('user'));

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const tripIdFromRoute = Number(routeParams.get('tripId'));

    console.log(this.user.uid);  

    // Find the product that correspond with the id provided in route.
    this.trip = trips.find(trip => trip.id === tripIdFromRoute);
  }

}
