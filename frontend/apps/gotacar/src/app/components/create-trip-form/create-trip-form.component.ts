import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../services/trips.service';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { Trip } from '../../shared/services/trip';
import { Location } from '../../shared/services/location-model';

@Component({
  selector: 'frontend-create-trip-form',
  templateUrl: './create-trip-form.component.html',
  styleUrls: ['./create-trip-form.component.scss']
})
export class CreateTripFormComponent {

  minDate: Date;


  createTripForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    fecha: ['', Validators.required],
    numeroPasajero: ['', Validators.required],
    comentarios: ['', Validators.required],
    price: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar,
    private tripService: TripsService, private geoService: GeocoderServiceService) {
    this.minDate = new Date();

  }

  async onSubmit() {
    this.hourIsValid()
    this.checkOrigen()

    const fecha = this.createTripForm.value.fecha;
    const horaInicio = this.createTripForm.value.horaInicio;
    const horaFin = this.createTripForm.value.horaFin;

    const hoursI = horaInicio.split(':')[0];
    const minutesI = horaInicio.split(':')[1];

    const hoursF = horaFin.split(':')[0];
    const minutesF = horaFin.split(':')[1];

    const startDatee = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hoursI, minutesI, 0);
    const endingDatee = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), hoursF, minutesF, 0);

    //////

    const coordinatesOrigin = await this.get_origin();
    const coordinatesTarget = await this.get_target();


    const LocationOrigen = {
      lat: coordinatesOrigin.lat,
      lng: coordinatesOrigin.lng,
      address: coordinatesOrigin.address,
    }

    const LocationDestino = {
      lat: coordinatesTarget.lat,
      lng: coordinatesTarget.lng,
      address: coordinatesTarget.address,
    }
    const trip: Trip = {
      starting_point: LocationOrigen,
      endingPoint: LocationDestino,
      price: this.createTripForm.value.price,
      startDate: startDatee,
      endingDate: endingDatee,
      cancelationDate: this.createTripForm.value.cancelationDate,
      comment: this.createTripForm.value.comment,
      places: this.createTripForm.value.numeroPasajero,
      canceled: false,
    }

    try {
      this.tripService.create_trip(trip);
    } catch (error) {
      console.error(error);
    }


  }

  checkOrigen() {
    const origen = this.createTripForm.value.origen;
    const destino = this.createTripForm.value.destino;

    const isValid = origen == destino;

    if (isValid) {
      this.openSnackBar(
        'El origen y el destino no pueden ser el mismo',
        'Cerrar'
      );
    }
  }

  hourIsValid() {

    const horaInicio = this.createTripForm.value.horaInicio.trim().toLowerCase();
    const horaFin = this.createTripForm.value.horaFin.trim().toLowerCase();

    const isValid = horaInicio < horaFin;

    if (!isValid) {
      this.openSnackBar(
        'La hora de inicio no puede ser posterior a la hora de fin del viaje',
        'Cerrar'
      );
    }

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
          address: results[0].address_components[1].long_name + ',' + results[0].address_components[0].long_name,
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
          address: results[0].address_components[1].long_name + ',' + results[0].address_components[0].long_name,
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