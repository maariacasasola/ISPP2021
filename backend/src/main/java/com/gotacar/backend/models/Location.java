package com.gotacar.backend.models;

import org.bson.codecs.pojo.annotations.BsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "raw")
public class Location {

    @BsonProperty("lng")
    public Double lng;

    @BsonProperty("lat")
    public Double lat;

    @BsonProperty("address")
    public String address;

    @BsonProperty("name")
    public String name;

    public Location(String name, String address, Double lat, Double lng) {
        this.name = name;
        this.address = address;
        this.lng = lng;
        this.lat = lat;
    }

}
