import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'frontend-trip-search-result-page',
  templateUrl: './trip-search-result-page.component.html',
  styleUrls: ['./trip-search-result-page.component.scss'],
})
export class TripSearchResultPageComponent implements OnInit {
  coordinatesOrigin;
  coordinatesTarget;
  places;
  date;

  trips;

  constructor(
    private _route: ActivatedRoute,
    private _trips_service: TripsService,
    private _geocodeService: GeocoderServiceService,
    private _snackBar: MatSnackBar
  ) {
    this.load_search_params();
  }

  ngOnInit(): void {}

  async load_search_params() {
    const params = this._route.snapshot.queryParams;
    this.places = params?.places;
    this.date = params?.date;
    this.coordinatesOrigin = await this.get_coordinates(params?.origin);
    this.coordinatesTarget = await this.get_coordinates(params?.target);
    if (this.coordinatesOrigin && this.coordinatesTarget) {
      this.get_search_results();
    }
  }

  async get_search_results() {
    try {
      this.trips = await this._trips_service.seach_trips(
        this.coordinatesOrigin,
        this.coordinatesTarget,
        this.places,
        new Date(this.date)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async get_coordinates(place_name) {
    try {
      const { results } = await this._geocodeService.get_location_from_address(
        place_name
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }
}
