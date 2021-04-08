package com.gotacar.backend.models;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder.Default;


@Getter
@Setter
public class CarData {

    public String car_plate;

    public Date enrollment_date;

    public String model;

    public String color;

    public CarData(String car_plate, Date enrollment_date, String model, String color) {
        this.car_plate = car_plate;
        this.enrollment_date = enrollment_date;
        this.model = model;
        this.color = color;
    }

    public CarData() {
    }
    


    
}
