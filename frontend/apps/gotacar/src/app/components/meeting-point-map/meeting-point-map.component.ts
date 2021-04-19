import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'frontend-meeting-point-map',
  templateUrl: './meeting-point-map.component.html',
  styleUrls: ['./meeting-point-map.component.scss'],
})
export class MeetingPointMapComponent {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
  zoom = 13;
  center = { lat: 37.3754865, lng: -6.0000992 };
  options: google.maps.MapOptions = {
    disableDefaultUI: false,
    disableDoubleClickZoom: false,
  };
  display?: google.maps.LatLngLiteral;
  markers = [];
  infoContent = '';

  @Input() location;

  ngOnChanges(changes: SimpleChanges) {
    this.update_marker();
  }

  update_marker() {
    this.markers = [];
    if (this.location?.lat && this.location?.lng) {
      const new_marker = {
        position: {
          lat: +this.location?.lat,
          lng: +this.location?.lng,
        },
        title: this.location?.name,
        info: this.location?.address,
      };
      this.center = new_marker.position;
      this.zoom = 15;
      this.markers.push(new_marker);
    }
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.info.open(marker);
  }
}
