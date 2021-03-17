package com.gotacar.backend.models;

import org.springframework.data.annotation.Id;

public class MeetingPoint {
  @Id
  public String id;

  public Double lng;
  public Double lat;
  public String name;
  public String address;

  public MeetingPoint() {
      
  }

  public MeetingPoint(Double lng, Double lat){
      this.lng = lng;
      this.lat = lat;
  }

  public MeetingPoint(Double lng, Double lat, String address, String name){
      this.lng = lng;
      this.lat = lat;
      this.address = address;
      this.name = name;
  }

  @Override
  public String toString() {
      return String.format("MeetingPoint[id=%s, name=%s]", id, name);
  }
}