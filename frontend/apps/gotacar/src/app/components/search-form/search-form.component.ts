import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'frontend-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  searchForm = this.fb.group({
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    fecha: ['', Validators.required],
    //numPasajeros: ['', Validators.required],
  });

  minDate: Date;

  origenLocation: Location;
  destinoLocation: Location;

  constructor(
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private geocodeService: GeocoderServiceService
  ) {
    this.minDate = new Date();
  }

  async onSubmit() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const coordinatesOrigin = await this.get_origin();
    const coordinatesTarget = await this.get_target();

  }

  async get_origin() {
    try {
      const { results } = await this.geocodeService.get_location_from_address(
        this.searchForm.value.origen
      );
      const cond1 = results[0].address_components[1].long_name == 'Sevilla';
      const cond2 = results[0].address_components[2].long_name == 'Sevilla';
      const cond3 = results[0].address_components[3].long_name == 'Sevilla';

      if (cond1 || cond2 || cond3) {
        const coordinates = {
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
      const { results } = await this.geocodeService.get_location_from_address(
        this.searchForm.value.destino
      );

      const cond1 = results[0].address_components[1].long_name == 'Sevilla';
      const cond2 = results[0].address_components[2].long_name == 'Sevilla';
      const cond3 = results[0].address_components[3].long_name == 'Sevilla';

      if (cond1 || cond2 || cond3) {
        const coordinates = {
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
