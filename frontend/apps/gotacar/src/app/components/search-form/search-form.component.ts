import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'frontend-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  searchForm = this.fb.group({
    origin: ['', Validators.required],
    target: ['', Validators.required],
    date: ['', Validators.required],
    // TODO: Poner required y poner formulario campo
    places: [1],
  });

  minDate: Date;

  origenLocation: Location;
  destinoLocation: Location;

  constructor(
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private geocodeService: GeocoderServiceService,
    private _trips_service: TripsService
  ) {
    this.minDate = new Date();
  }

  async onSubmit() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    console.log(this.searchForm)
    const coordinatesOrigin = await this.get_origin();
    const coordinatesTarget = await this.get_target();
    const { places, date } = this.searchForm.value;
    console.log(places);
    console.log(date);

    try {
      const result = await this._trips_service.seach_trips(
        coordinatesOrigin,
        coordinatesTarget,
        places,
        date
      );

      // TODO: Mostrar el resultado en una página
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  async get_origin() {
    try {
      const { results } = await this.geocodeService.get_location_from_address(
        this.searchForm.value.origin
      );

      const search_result = results.filter((result) =>
        JSON.stringify(result).includes('Sevilla')
      );

      if (search_result.length > 0) {
        const coordinates = {
          lat: search_result[0]?.geometry?.location?.lat,
          lng: search_result[0]?.geometry?.location?.lng,
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
      const { results } = await this.geocodeService.get_location_from_address(
        this.searchForm.value.target
      );

      const search_result = results.filter((result) =>
        JSON.stringify(result).includes('Sevilla')
      );

      if (search_result.length > 0) {
        const coordinates = {
          lat: search_result[0]?.geometry?.location?.lat,
          lng: search_result[0]?.geometry?.location?.lng,
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
