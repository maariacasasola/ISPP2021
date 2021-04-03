import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../services/trips.service';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { Trip } from '../../shared/services/trip';
import { Location } from '../../shared/services/location-model';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-create-trip-form',
  templateUrl: './create-trip-form.component.html',
  styleUrls: ['./create-trip-form.component.scss'],
})
export class CreateTripFormComponent {
  minDate: string;

  createTripForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    fechaHoraInicio: ['', Validators.required],
    fechaHoraFin: ['', Validators.required],
    numeroPasajero: ['', Validators.required],
    comentarios: ['', Validators.required],
    price: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private tripService: TripsService,
    private geoService: GeocoderServiceService,
    public router: Router
  ) {
    this.minDate = new Date().toISOString().slice(0, 16);
  }

  async onSubmit() {
    if (this.createTripForm.invalid) {
      this.createTripForm.markAllAsTouched();
      return;
    }

    const dateIsValid = this.checkDates();
    if (!dateIsValid) {
      this.openSnackBar(
        'La fecha de inicio debe ser anterior a la fecha de finalización ',
        'Cerrar'
      );
      return;
    }

    const origin_and_target_valids = this.checkOrigen();
    if (!origin_and_target_valids) {
      this.openSnackBar(
        'El origen y el destino del viaje no pueden coincidir',
        'Cerrar'
      );
      return;
    }

    const coordinatesOrigin = await this.get_origin();
    const coordinatesTarget = await this.get_target();

    const LocationOrigen: Location = {
      name: '',
      lat: coordinatesOrigin.lat,
      lng: coordinatesOrigin.lng,
      address: coordinatesOrigin.address,
    };

    const LocationDestino: Location = {
      name: '',
      lat: coordinatesTarget.lat,
      lng: coordinatesTarget.lng,
      address: coordinatesTarget.address,
    };

    const trip: Trip = {
      starting_point: LocationOrigen,
      ending_point: LocationDestino,
      price: Number(this.createTripForm.value.price) * 100,
      start_date: new Date(this.createTripForm.value.fechaHoraInicio),
      end_date: new Date(this.createTripForm.value.fechaHoraFin),
      comments: String(this.createTripForm.value.comentarios),
      places: Number(this.createTripForm.value.numeroPasajero),
      cancelationDateLimit: null,
    };

    try {
      const response = this.tripService.create_trip(trip);
      this.router.navigate(['home']);
    } catch (error) {
      console.error(error);
    }
  }

  checkOrigen() {
    const origen = this.createTripForm.value.origen;
    const destino = this.createTripForm.value.destino;
    return origen !== destino;
  }

  checkDates() {
    const startDateHour = this.createTripForm.value.fechaHoraInicio;
    const endingDateHour = this.createTripForm.value.fechaHoraFin;

    return startDateHour < endingDateHour;
  }

  async get_origin() {
    try {
      const { results } = await this.geoService.get_location_from_address(
        this.createTripForm.value.origen
      );

      const cond1 = results[0].address_components[1].long_name == 'Sevilla';
      const cond2 = results[0].address_components[2].long_name == 'Sevilla';
      const cond3 = results[0].address_components[3].long_name == 'Sevilla';

      if (cond1 || cond2 || cond3) {
        const coordinates = {
          name: this.createTripForm.value.origen,
          address:
            results[0].address_components[1].long_name +
            ',' +
            results[0].address_components[0].long_name,
          lat: results[0]?.geometry?.location?.lat,
          lng: results[0]?.geometry?.location?.lng,
        };
        return coordinates;
      } else {
        this.openSnackBar(
          'Solo trabajamos con localizaciones de Sevilla',
          'Introduzca de nuevo el origen'
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async get_target() {
    try {
      const { results } = await this.geoService.get_location_from_address(
        this.createTripForm.value.destino
      );

      const cond1 = results[0].address_components[1].long_name == 'Sevilla';
      const cond2 = results[0].address_components[2].long_name == 'Sevilla';
      const cond3 = results[0].address_components[3].long_name == 'Sevilla';

      if (cond1 || cond2 || cond3) {
        const coordinates = {
          name: this.createTripForm.value.origen,
          address:
            results[0].address_components[1].long_name +
            ',' +
            results[0].address_components[0].long_name,
          lat: results[0]?.geometry?.location?.lat,
          lng: results[0]?.geometry?.location?.lng,
        };
        return coordinates;
      } else {
        this.openSnackBar(
          'Solo trabajamos con localizaciones de Sevilla',
          'Introduzca de nuevo el destino'
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }
}
