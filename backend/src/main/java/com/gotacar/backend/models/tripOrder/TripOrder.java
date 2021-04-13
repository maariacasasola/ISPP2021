package com.gotacar.backend.models.tripOrder;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.trip.Trip;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
public class TripOrder {
    @Id
    public String id;

    @NotNull
    @DBRef
    public Trip trip;

    @NotNull
    @DBRef
    public User user;

    @NotNull
    public LocalDateTime date;

    @Min(10)
    @Max(1000)
    @NotNull
    public Integer price;

    @NotBlank
    public String paymentIntent;

    @NotNull
    @Min(1)
    @Max(4)
    public Integer places;

    private String status;

    public TripOrder(Trip trip, User user, LocalDateTime date, Integer price, String paymentIntent, Integer places) {
        this.trip = trip;
        this.user = user;
        this.date = date;
        this.price = price;
        this.paymentIntent = paymentIntent;
        this.places = places;
        this.status = "PROCCESSING";
    }
}
