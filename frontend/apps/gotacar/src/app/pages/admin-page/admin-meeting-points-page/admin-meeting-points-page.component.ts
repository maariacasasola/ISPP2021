import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { MeetingPointService } from '../../../services/meeting-point.service';
import { MeetingPoint } from '../../../shared/services/meeting-point';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'frontend-admin-meeting-points-page',
  templateUrl: './admin-meeting-points-page.component.html',
  styleUrls: ['./admin-meeting-points-page.component.scss'],
})
export class AdminMeetingPointsPageComponent {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 14;
  center = { lat: 37.38868247472144, lng: -5.984124294177864 };
  isShow = true;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  };
  display?: google.maps.LatLngLiteral;
  markers = [];
  infoContent = '';
  infoPosition = '';

  meeting_points;
  meeting_points_array = [];

  new_meeting_point = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
  });

  constructor(
    private _meeting_point_service: MeetingPointService,
    private _snackBar: MatSnackBar
  ) {
    this.get_all_meeting_points();
  }

  async get_all_meeting_points() {
    try {
      this.meeting_points = await this._meeting_point_service.get_all_meeting_points();

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
      this.openSnackBar("Se ha producido un error al obtener los puntos de encuentro", 'Cerrar');
    }
  }

  toggleDisplayCreation() {
    this.isShow = !this.isShow;
    this.new_meeting_point.reset();
  }

  resetForm() {
    this.new_meeting_point.reset();
  }

  async deleteMarker(infoPosition) {
    try {
      this.meeting_points = await this._meeting_point_service.get_all_meeting_points();
      this.meeting_points_array = Array.from(this.meeting_points);
      const meeting_point = this.meeting_points_array.find(
        (x) => x.lat === infoPosition.lat && x.lng === infoPosition.lng
      );
      const response = await this._meeting_point_service.delete_meeting_point(meeting_point.id);
      if (response) {
        this.openSnackBar(
          'Punto eliminado satisfactoriamente', "Cerrar");
      }
      this.markers = [];
      await this.get_all_meeting_points();
    } catch (error) {
      this.openSnackBar("Se ha producido un error al eliminar el punto de encuentro", "Cerrar");
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.new_meeting_point.setValue({
      name: '',
      address: '',
      lat: Number(event.latLng.lat()),
      lng: Number(event.latLng.lng()),
    });
  }

  async onSubmit() {
    try {
      const newMeetingPoint: MeetingPoint = {
        name: String(this.new_meeting_point.controls['name'].value),
        address: String(this.new_meeting_point.controls['address'].value),
        lat: Number(this.new_meeting_point.controls['lat'].value),
        lng: Number(this.new_meeting_point.controls['lng'].value),
      };
      const response = await this._meeting_point_service.post_meeting_point(
        newMeetingPoint
      );
      const meeting_point_created = response['address'].toString();
      if (response) {
        this.openSnackBar(
          'Punto creado satisfactoriamente en ' + meeting_point_created,
          'Cerrar'
        );
      }
      this.get_all_meeting_points();
    } catch (error) {
      console.error(error);
    }
  }

  openInfo(marker: MapMarker, content, position) {
    this.infoContent = content;
    this.infoPosition = position;
    this.info.open(marker);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }
}
