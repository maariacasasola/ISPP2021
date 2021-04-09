package com.gotacar.backend.models;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarData {

    public String car_plate;

    public LocalDate enrollment_date;

    public String model;

    public String color;

    public CarData(String car_plate, LocalDate enrollment_date, String model, String color) {
        this.car_plate = car_plate;
        this.enrollment_date = enrollment_date;
        this.model = model;
        this.color = color;
    }

    public CarData() {
    }
    


    
}
