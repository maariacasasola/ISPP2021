import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { GeocoderServiceService } from '../../services/geocoder-service.service';
import { MeetingPointService } from '../../services/meeting-point.service';
import { TripsService } from '../../services/trips.service';
import { convert_cent_to_eur } from '../../shared/utils/functions';

@Component({
  selector: 'frontend-trip-search-result-page',
  templateUrl: './trip-search-result-page.component.html',
  styleUrls: ['./trip-search-result-page.component.scss'],
})
export class TripSearchResultPageComponent {
  coordinatesOrigin;
  coordinatesTarget;
  places;
  date;

  trips;
  filter_opened;
  filter = {
    order_by: null,
    max_price: 10000,
    min_price: 0,
  };

  min_price_range;
  max_price_range;
  price_range_options;

  meeting_points;

  constructor(
    private _route: ActivatedRoute,
    private _trips_service: TripsService,
    private _geocodeService: GeocoderServiceService,
    private _snackBar: MatSnackBar,
    private _meeting_points_service: MeetingPointService
  ) {
    this.load_search_params();
  }

  async load_search_params() {
    await this.get_all_meeting_points();

    const params = this._route.snapshot.queryParams;
    this.places = params?.places;
    this.date = params?.date;

    this.coordinatesOrigin = await this.get_coordinates(params?.origin);
    this.coordinatesTarget = await this.get_coordinates(params?.target);
    if (this.coordinatesOrigin && this.coordinatesTarget) {
      this.get_search_results();
    }
  }

  async get_all_meeting_points() {
    try {
      this.meeting_points = await this._meeting_points_service.get_all_meeting_points();
    } catch (error) {
      console.error(error);
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
      this.trips = this.trips.filter((x) => this.tipIsInHour(x.startDate));
      this.set_filters();
    } catch (error) {
      console.error(error);
    }
  }

  async get_coordinates(place_name) {
    try {
      // Checkeamos por si ha introducido un meeting point
      const meeting_point_matched = this.meeting_points.filter(
        (meeting_point) => meeting_point.name === place_name
      );
      if (meeting_point_matched.length > 0) {
        return {
          lat: meeting_point_matched[0].lat,
          lng: meeting_point_matched[0].lng,
        };
      }

      // En caso de que no sea un meeting point, llamamos a geocoding
      const { results } = await this._geocodeService.get_location_from_address(
        place_name
      );

      const search_result = results.filter((result) =>
        JSON.stringify(result).includes('Sevilla')
      );

      if (search_result.length > 0) {
        return {
          lat: search_result[0]?.geometry?.location?.lat,
          lng: search_result[0]?.geometry?.location?.lng,
        };
      } else {
        this.openSnackBar('Solo trabajamos con localizaciones de Sevilla');
      }
    } catch (error) {
      console.error(error);
    }
  }

  tipIsInHour(startDate) {
    return moment(startDate).isAfter(moment().add(10, 'minutes'));
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }

  order_by_changed(value) {
    this.filter = { ...this.filter, order_by: value };
  }

  change_filter_min_price(value) {
    this.filter = { ...this.filter, min_price: value };
  }

  change_filter_max_price(value) {
    this.filter = { ...this.filter, max_price: value };
  }

  set_filters() {
    const max_price = Math.max(...this.trips.map((o) => o.price), 0);
    const min_price = Math.min(...this.trips.map((o) => o.price), 0);
    this.min_price_range = min_price;
    this.max_price_range = max_price;
    this.price_range_options = {};
    this.price_range_options.translate = (value: number): string => {
      return convert_cent_to_eur(value) + ' €';
    };
    this.price_range_options.floor = min_price;
    this.price_range_options.ceil = max_price;
  }
}
