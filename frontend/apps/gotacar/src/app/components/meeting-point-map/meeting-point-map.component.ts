import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'frontend-meeting-point-map',
  templateUrl: './meeting-point-map.component.html',
  styleUrls: ['./meeting-point-map.component.scss'],
})
export class MeetingPointMapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 12;
  center = { lat: 37.3754865, lng: -6.0250992 };

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  };
  display?: google.maps.LatLngLiteral;
  markers = [
    {
      position: { lat: 37.3754, lng: -6.025 },
      title: 'prueba',
      info: 'Info de punto prueba',
    },
  ];
  infoContent = '';

  ngOnInit(): void {}

  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.info.open(marker);
  }
}
