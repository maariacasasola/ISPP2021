import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'apps/gotacar/src/environments/environment';
import { AuthServiceService } from '../../services/auth-service.service';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'frontend-trip-details-page',
  templateUrl: './trip-details-page.component.html',
  styleUrls: ['./trip-details-page.component.scss'],
})
export class TripDetailsPageComponent {
  page_title = 'Detalles del viaje';
  trip;
  stripePromise = loadStripe(environment.stripe_api_key);
  priceId = 'pi_1IYy25J65m70MT01Iq6TEyKq';

  constructor(
    private _route: ActivatedRoute,
    private _trip_service: TripsService
  ) {
    this.load_trip();
  }

  private get_trip_id(): String {
    return this._route.snapshot.params['trip_id'];
  }

  private async load_trip() {
    try {
      this.trip = await this._trip_service.get_trip(this.get_trip_id());
      console.log(this.trip);
    } catch (error) {
      console.error(error);
    }
  }

  async order_trip() {
    // Call your backend to create the Checkout session.
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: 'cs_test_a13m1QAjYFE4OlWfrl1IAqQnaanGGy98Mv4kp5pBX05tdSgLymHvTmuvas'
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }
  }
}
