import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { MeetingPointService } from '../../../services/meeting-point.service';

@Component({
  selector: 'frontend-admin-meeting-points-page',
  templateUrl: './admin-meeting-points-page.component.html',
  styleUrls: ['./admin-meeting-points-page.component.scss'],
})
export class AdminMeetingPointsPageComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 14;
  center = { lat: 37.38868247472144, lng: -5.984124294177864 };
  isShow = true;
  isShowFilter = true;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  };
  display?: google.maps.LatLngLiteral;
  markers = [];
  infoContent = '';

  meeting_points;

  filter_meeting_point = new FormGroup({
    filter: new FormControl('', Validators.required),
  });
  new_meeting_point = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
  });

  constructor(private _meeting_point_service: MeetingPointService) {
    this.get_all_meeting_points();
  }

  ngOnInit(): void {}

  async get_all_meeting_points() {
    try {
      this.meeting_points = await this._meeting_point_service.get_all_meeting_points();
      console.log(this.meeting_points);
      this.meeting_points.forEach((meeting_point) => {
        this.markers.push({
          position: {
            lat: meeting_point?.lat,
            lng: meeting_point?.lng,
          },
          title: meeting_point?.name,
          info: meeting_point?.address,
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  toggleDisplayCreation() {
    this.isShow = !this.isShow;
    this.isShowFilter = true;
  }

  toggleDisplayFilter() {
    this.isShowFilter = !this.isShowFilter;
    this.isShow = true;
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
  }

  filterMarker() {
    for (var marker of this.markers) {
      let filter = this.filter_meeting_point.controls['filter'].value;
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.new_meeting_point.setValue({
      name: '',
      address: '',
      lat: Number(event.latLng.lat()),
      lng: Number(event.latLng.lng()),
    });

    // this.markers.push({
    //   position: {
    //     lat: Number(event.latLng.lat()),
    //     lng: Number(event.latLng.lng()),
    //   },
    //   title: 'any',
    //   info: 'any',
    // });
  }

  onSubmit() {
    this.markers.push({
      position: {
        lat: Number(this.new_meeting_point.controls['lat'].value),
        lng: Number(this.new_meeting_point.controls['lng'].value),
      },
      title: String(this.new_meeting_point.controls['address'].value),
      info: String(this.new_meeting_point.controls['name'].value),
    });
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.info.open(marker);
  }
}
