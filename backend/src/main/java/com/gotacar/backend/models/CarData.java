package com.gotacar.backend.models;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarData {

    private String carPlate;

    private LocalDate enrollmentDate;

    private String model;

    private String color;

    public CarData(String carPlate, LocalDate enrollmentDate, String model, String color) {
        this.carPlate = carPlate;
        this.enrollmentDate = enrollmentDate;
        this.model = model;
        this.color = color;
    }

    public CarData() {
    }

}
