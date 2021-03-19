import { Component, Input, OnInit,ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'


@Component({
  selector: 'frontend-admin-meeting-points-page',
  templateUrl: './admin-meeting-points-page.component.html',
  styleUrls: ['./admin-meeting-points-page.component.scss']
})
export class AdminMeetingPointsPageComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  
  zoom = 12
  center = {lat: 37.3754865, lng: -6.0250992};
  isShow = true;
  isShowFilter = true;
  options: google.maps.MapOptions = {
   
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  }
  display?: google.maps.LatLngLiteral;
  markers = [{position:{lat:37.3754,lng:-6.025},title:'prueba',info:'Info de punto prueba'}]
  infoContent = ''

  filter_meeting_point = new FormGroup({
    filter: new FormControl("",Validators.required)
  })
  new_meeting_point = new FormGroup({
    name: new FormControl("",Validators.required),
    address: new FormControl("",Validators.required),
    lat: new FormControl("",Validators.required),
    lng: new FormControl("",Validators.required)
  });
  ngOnInit():void {
    
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
    console.log(event)
  }
  filterMarker(){
    
  }
  

  
  addMarker(event: google.maps.MapMouseEvent) {
    this.new_meeting_point.setValue({
      name:"",
      address:"",
      lat: Number(event.latLng.lat()),
      lng: Number(event.latLng.lng()),

    })
    
    //this.markers.push({position:{lat: Number(event.latLng.lat()),lng:Number(event.latLng.lng())},title:'any',info:'any'});
  }

  onSubmit(){
 
    this.markers.push({position:{lat: Number(this.new_meeting_point.controls['lat'].value),
    lng:Number(this.new_meeting_point.controls['lng'].value)},
    title:String(this.new_meeting_point.controls['address'].value),
    info:String(this.new_meeting_point.controls['name'].value)});
    
  }
  
  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.info.open(marker)
  }

}
