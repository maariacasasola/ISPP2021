import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'apps/gotacar/src/environments/environment';
import { DriverProfileDataDialogComponent } from '../../components/driver-profile-data-dialog/driver-profile-data-dialog.component';
import { TripOrderFormDialogComponent } from '../../components/trip-order-form-dialog/trip-order-form-dialog.component';
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
    private _my_dialog: MatDialog,
    private _trip_service: TripsService,
    private _snackbar: MatSnackBar,
    private _auth_service: AuthServiceService,
    private _dialog: MatDialog
  ) {
    this.load_trip();
  }

  private get_trip_id(): string {
    return this._route.snapshot.params['trip_id'];
  }
  open_driver_data_dialog(trip){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog';
    dialogConfig.data = {
     trip:this.trip,
    };

    const dialogRef = this._my_dialog.open(
      DriverProfileDataDialogComponent,
      dialogConfig
    );
  }
  get_profile_photo() {
    if (this.trip?.driver?.profilePhoto) {
      return this.trip?.driver?.profilePhoto;
    }
    return 'assets/img/generic-user.jpg';
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
      if(error.error.message === '400 BAD_REQUEST "No puedes reservar tu propio viaje"'){
        this._snackbar.open('No puedes reservar tu propio viaje', null, {
          duration: 3000,
        });
      }
      if(error.error.message === '400 BAD_REQUEST "El viaje no tiene tantas plazas"'){
        this._snackbar.open('El viaje no tiene tantas plazas', null, {
          duration: 3000,
        });
      }     
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
    return this.trip?.places > 0 && new Date(this.trip?.startDate) > new Date() && this.trip?.canceled !==true;
  }
}
