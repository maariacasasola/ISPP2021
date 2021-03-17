import { Component, Input, OnInit,ViewChild  } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'

@Component({
  selector: 'frontend-meeting-point-map',
  templateUrl: './meeting-point-map.component.html',
  styleUrls: ['./meeting-point-map.component.scss']
})
export class MeetingPointMapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  
  zoom = 12
  center = {lat: 37.3754865, lng: -6.0250992};
  
  display?: google.maps.LatLngLiteral;
  markers = [{position:{lat:37.3754,lng:-6.025},title:'prueba',info:'info'}]
  infoContent = ''

  ngOnInit():void {
    
  }

  

  click(event: google.maps.MouseEvent) {
    console.log(event)
  }

  

  
  addMarker(event: google.maps.MapMouseEvent) {
    this.markers.push({position:{lat: Number(event.latLng.lat()),lng:Number(event.latLng.lng())},title:'any',info:'any'});
  }

  
  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.info.open(marker)
  }
}
  

