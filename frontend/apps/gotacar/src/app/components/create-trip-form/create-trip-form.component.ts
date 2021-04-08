import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../services/trips.service';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { Trip } from '../../shared/services/trip';
import { Location } from '../../shared/services/location-model';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MeetingPointService } from '../../services/meeting-point.service';
import { levenshtein } from 'string-comparison';

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

  location_origin: Location;
  location_target: Location;
  searchbar_meeting_points = [];
  meeting_points;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private tripService: TripsService,
    private geoService: GeocoderServiceService,
    private _meeting_points_service: MeetingPointService,
    public router: Router
  ) {
    this.minDate = new Date().toISOString().slice(0, 16);
    this.get_all_meeting_points();
  }

  async submit() {
    if (this.createTripForm.invalid) {
      this.createTripForm.markAllAsTouched();
      return;
    }

    if (!this.checkDates()) {
      this.openSnackBar(
        'La fecha de inicio debe ser anterior a la fecha de finalización'
      );
      return;
    }

    if (!this.checkOrigen()) {
      this.openSnackBar('El origen y el destino del viaje no pueden coincidir');
      return;
    }

    const trip: Trip = {
      starting_point: this.location_origin,
      ending_point: this.location_target,
      price: Number(this.createTripForm.value.price) * 100,
      start_date: new Date(this.createTripForm.value.fechaHoraInicio),
      end_date: new Date(this.createTripForm.value.fechaHoraFin),
      comments: String(this.createTripForm.value.comentarios),
      places: Number(this.createTripForm.value.numeroPasajero),
      cancelationDateLimit: null,
    };

    try {
      const response = this.tripService.create_trip(trip);
      if (response) {
        this.router.navigate(['home']);
      }
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

      const search_result = results.filter((result) =>
        JSON.stringify(result).includes('Sevilla')
      );

      if (search_result.length > 0) {
        this.location_origin = {
          name: '',
          address:
            search_result[0].address_components[1].long_name +
            ', ' +
            search_result[0].address_components[0].long_name,
          lat: search_result[0]?.geometry?.location?.lat,
          lng: search_result[0]?.geometry?.location?.lng,
        };
        this.searchbar_meeting_points = [];
      } else {
        this.openSnackBar('Solo trabajamos con localizaciones de Sevilla');
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

      const search_result = results.filter((result) =>
        JSON.stringify(result).includes('Sevilla')
      );

      if (search_result.length > 0) {
        this.location_target = {
          name: '',
          address:
            search_result[0].address_components[1].long_name +
            ', ' +
            search_result[0].address_components[0].long_name,
          lat: search_result[0]?.geometry?.location?.lat,
          lng: search_result[0]?.geometry?.location?.lng,
        };
        this.searchbar_meeting_points = [];
      } else {
        this.openSnackBar('Solo trabajamos con localizaciones de Sevilla');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async go_to_step_2(stepper: MatStepper) {
    if (this.location_origin?.lat && this.location_origin?.lng) {
      this.searchbar_meeting_points = [];
      stepper.selected.completed = true;
      stepper.next();
    } else {
      this.openSnackBar('Selecciona el punto de partida');
    }
  }

  async go_to_step_3(stepper: MatStepper) {
    if (this.location_target?.lat && this.location_target?.lng) {
      stepper.selected.completed = true;
      stepper.next();
    } else {
      this.openSnackBar('Selecciona el punto de destino');
    }
  }

  async get_all_meeting_points() {
    try {
      this.meeting_points = await this._meeting_points_service.get_all_meeting_points();
    } catch (error) {
      console.error(error);
    }
  }

  selected_meeting_point_origin(meeting_point) {
    this.location_origin = {
      name: meeting_point?.name,
      address: meeting_point?.address,
      lat: meeting_point?.lat,
      lng: meeting_point?.lng,
    };
    this.createTripForm.get('origen').setValue(meeting_point.name);
    this.searchbar_meeting_points = [];
  }

  selected_meeting_point_target(meeting_point) {
    this.location_target = {
      name: meeting_point?.name,
      address: meeting_point?.address,
      lat: meeting_point?.lat,
      lng: meeting_point?.lng,
    };
    this.createTripForm.get('destino').setValue(meeting_point.name);
    this.searchbar_meeting_points = [];
  }

  search_meeting_points(text) {
    if (!text) {
      this.searchbar_meeting_points = null;
      return;
    }
    const meeting_points_name = this.meeting_points.map(
      (meeting_point) => meeting_point.name
    );
    const search_results: any[] = levenshtein.sortMatch(
      text,
      meeting_points_name
    );
    const best_results = search_results
      .slice(search_results.length - 3, search_results.length)
      .map((result) => result.member);
    this.searchbar_meeting_points = this.meeting_points.filter(
      (meeting_point) => best_results.includes(meeting_point.name)
    );
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
