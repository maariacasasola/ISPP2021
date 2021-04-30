import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingPointService } from '../../services/meeting-point.service';
import { levenshtein } from 'string-comparison';

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
    places: [1],
  });

  minDate: Date;

  origenLocation: Location;
  destinoLocation: Location;

  meeting_points = [];
  searchbar_meeting_points_origin = [];
  searchbar_meeting_points_target = [];

  constructor(
    private _meeting_points_service: MeetingPointService,
    private fb: FormBuilder,
    private _router: Router
  ) {
    this.minDate = new Date();
    this.get_all_meeting_points();
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

  async get_all_meeting_points() {
    try {
      this.meeting_points = await this._meeting_points_service.get_all_meeting_points();
    } catch (error) {
      console.error(error);
    }
  }

  search_meeting_points_origin(text) {
    if (!text) {
      this.searchbar_meeting_points_origin = null;
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
    this.searchbar_meeting_points_origin = this.meeting_points.filter(
      (meeting_point) => best_results.includes(meeting_point.name)
    );
  }

  search_meeting_points_target(text) {
    if (!text) {
      this.searchbar_meeting_points_target = null;
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
    this.searchbar_meeting_points_target = this.meeting_points.filter(
      (meeting_point) => best_results.includes(meeting_point.name)
    );
  }

  selected_meeting_point_origin(meeting_point) {
    this.searchForm.get('origin').setValue(meeting_point.name);
    this.searchbar_meeting_points_origin = [];
  }

  selected_meeting_point_target(meeting_point) {
    this.searchForm.get('target').setValue(meeting_point.name);
    this.searchbar_meeting_points_target = [];
  }

  clear_meeting_points() {
    this.searchbar_meeting_points_target = [];
    this.searchbar_meeting_points_origin = [];
  }
}
