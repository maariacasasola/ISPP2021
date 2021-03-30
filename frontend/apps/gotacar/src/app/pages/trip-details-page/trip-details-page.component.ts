import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
    private _snackbar: MatSnackBar,
    private _auth_service: AuthServiceService
  ) {
    this.load_trip();
  }

  private get_trip_id(): String {
    return this._route.snapshot.params['trip_id'];
  }

  private async load_trip() {
    try {
      this.trip = await this._trip_service.get_trip(this.get_trip_id());
    } catch (error) {
      console.error(error);
    }
  }

  get_trip_description() {
    return (
      'Viaje desde ' +
      this.trip?.startingPoint?.address +
      ' hasta ' +
      this.trip?.endingPoint?.address
    );
  }

  async order_trip() {
    // Comprobamos que esté logueado
    if (!this._auth_service.is_client()) {
      this._snackbar.open('Tienes que loguearte para continuar', null, {
        duration: 3000,
      });
      return;
    }

    try {
      // Creamos sesión en stripe para pagar
      const { session_id } = await this._trip_service.create_stripe_session(
        this.get_trip_id(),
        2,
        this.get_trip_description()
      );
      // Vamos al checkout para procesar el pago
      await this.go_to_checkout(session_id);
    } catch (error) {
      console.error(error);
      this._snackbar.open('Ha ocurrido un error al comprar el viaje', null, {
        duration: 3000,
      });
    }
  }

  async go_to_checkout(session_id) {
    const stripe = await this.stripePromise;
    const response = await stripe.redirectToCheckout({
      sessionId: session_id,
    });
    console.log(response);
    if (response.error) {
      this._snackbar.open('Ha ocurrido un error al procesar el pago', null, {
        duration: 3000,
      });
    } else {
      console.log('JEJEEEE');
    }
  }
}
