import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'apps/gotacar/src/environments/environment';
import { RatingUserDialogComponent } from '../../components/rating-user-dialog/rating-user-dialog.component';
import { TripOrderFormDialogComponent } from '../../components/trip-order-form-dialog/trip-order-form-dialog.component';
import { AuthServiceService } from '../../services/auth-service.service';
import { TripsService } from '../../services/trips.service';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';
@Component({
  selector: 'frontend-trip-details-page',
  templateUrl: './trip-details-page.component.html',
  styleUrls: ['./trip-details-page.component.scss'],
})
export class TripDetailsPageComponent {
  today=new Date();
  fecha;
  user_already_rated;
  page_title = 'Detalles del viaje';
  trip;
  stripePromise = loadStripe(environment.stripe_api_key);

  constructor(
    private _user_service: UsersService,
    private _route: ActivatedRoute,
    private _trip_service: TripsService,
    private _snackbar: MatSnackBar,
    private _auth_service: AuthServiceService,
    private _dialog: MatDialog
  ) {
    this.load_trip();
    this.driver_is_rated();
   
  }

  private get_trip_id(): string {
    return this._route.snapshot.params['trip_id'];
  }

  private async load_trip() {
    
    
    
    try {
      this.trip = await this._trip_service.get_trip(this.get_trip_id());
      this.fecha = new Date(this.trip.startDate);
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
      const trip_order_dialog = this._dialog.open(
        TripOrderFormDialogComponent,
        {
          data: {
            trip_description: this.get_trip_description(),
            max_places: this.trip.places,
          },
          panelClass: 'login-dialog',
        }
      );

      const response = await trip_order_dialog.afterClosed().toPromise();

      if (!response) {
        return;
      }

      // Creamos sesión en stripe para pagar
      const { session_id } = await this._trip_service.create_stripe_session(
        this.get_trip_id(),
        response.places,
        this.get_trip_description()
      );
      // Vamos al checkout para procesar el pago
      await this.go_to_checkout(session_id);
    } catch (error) {
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
    if (response.error) {
      this._snackbar.open('Ha ocurrido un error al procesar el pago', null, {
        duration: 3000,
      });
    }
  }

  show_buy_button() {
    return this.trip?.places > 0 && new Date(this.trip?.startDate) > new Date();
  }
  async driver_is_rated() {
    this.trip = await this._trip_service.get_trip(this.get_trip_id());
    try {
      const data = {
        id_users: this.trip?.driver?.id + ',',
        trip_id: this.get_trip_id(),
      };
      const response = await this._user_service.check_users_rated(data);
      if (response) {
        this.user_already_rated = response;
      }
    } catch (error) {
      this._snackbar.open(
        'Hemos tenido un problema al verificar las valoraciones de este conductor'
      );
    }
  }

  async openDialogRating(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
      to: id,
      trip_id: this.get_trip_id(),
    };

    const dialogRef = this._dialog.open(
      RatingUserDialogComponent,
      dialogConfig
    );

    const dialog_response = await dialogRef.afterClosed().toPromise();
    if (dialog_response) {
      try {
        const response = await this._user_service.rate_user(dialog_response);
        if (response) {
          this._snackbar.open('Tu valoración ha sido exitosa', null, {
            duration: 3000,
          });
          this.load_trip();
          this.driver_is_rated();
        }
      } catch (error) {
        this._snackbar.open('Tu valoración no se ha podido realizar', null, {
          duration: 3000,
        });
      }
    }
  }
}
