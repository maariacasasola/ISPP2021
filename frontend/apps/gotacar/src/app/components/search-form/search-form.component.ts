import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsService } from '../../services/trips.service';
import { Router } from '@angular/router';

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
    private _router: Router
  ) {
    this.minDate = new Date();
  }

  async onSubmit() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const { places, date, origin, target } = this.searchForm.value;

    this._router.navigate(['/', 'trip-search-result'], {
      queryParams: {
        origin,
        target,
        places,
        date,
      },
    });
  }
}
