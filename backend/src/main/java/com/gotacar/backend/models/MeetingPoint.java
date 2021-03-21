package com.gotacar.backend.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetingPoint {
    @Id
    public String id;

    @NotNull
    public Double lng;
    @NotNull
    public Double lat;
    
    public String name;
    
    @NotBlank
    @Length(max = 240, message = "La longitud de la dirección no puede ser mayor a 240")
    public String address;

    public MeetingPoint() {
    }

    public MeetingPoint(Double lat, Double lng) {
        this.lng = lng;
        this.lat = lat;
    }

    public MeetingPoint(Double lat, Double lng, String address, String name) {
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