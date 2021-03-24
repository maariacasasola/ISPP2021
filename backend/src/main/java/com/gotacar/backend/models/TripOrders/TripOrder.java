package com.gotacar.backend.models.TripOrders;

import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
@Setter
public class TripOrder {
    @Id
    public String id;

    public Trip trip;

    public User user;

    public LocalDateTime date;

    public Integer price;

    public String payment_intent;

    public Integer places;

    public String status;

    public TripOrder(Trip trip, User user, LocalDateTime date, Integer price, String payment_intent, Integer places, String status) {
        this.trip = trip;
        this.user = user;
        this.date = date;
        this.price = price;
        this.payment_intent = payment_intent;
        this.places = places;
        this.status = status;
    }
}
