import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'frontend-trip-map',
  templateUrl: './trip-map.component.html',
  styleUrls: ['./trip-map.component.scss'],
})
export class TripMapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  @Input() trip;
  @Input() zoom = 13;
  center = { lat: 37.3854865, lng: -6.0000981 };

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  };
  display?: google.maps.LatLngLiteral;

  markers = [];
  marker_info;

  constructor() {}

  ngOnInit() {
    this.load_markers();
  }

  openInfo(marker: MapMarker, content) {    
    this.marker_info = content;
    this.info.open(marker);
  }

  private load_markers() {
    const origin = {
      position: {
        lat: this.trip?.startingPoint?.lat,
        lng: this.trip?.startingPoint?.lng,
      },
      title: this.trip?.startingPoint?.name,
      info: this.trip?.startingPoint?.address,
    };
    const target = {
      position: {
        lat: this.trip?.endingPoint?.lat,
        lng: this.trip?.endingPoint?.lng,
      },
      title: this.trip?.endingPoint?.name,
      info: this.trip?.endingPoint?.address,
    };
    this.markers.push(origin, target);
  }
}
