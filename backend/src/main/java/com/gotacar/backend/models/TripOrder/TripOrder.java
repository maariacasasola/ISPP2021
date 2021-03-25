package com.gotacar.backend.models.TripOrder;

import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

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
    public Trip trip;

    @NotNull
    public User user;

    @NotNull
    public LocalDateTime date;

    @Min(10)
    @Max(1000)
    @NotNull
    public Integer price;

    @NotBlank
    public String payment_intent;

    @NotNull
    @Min(1)
    @Max(4)
    public Integer places;

    public String status;

    public TripOrder(Trip trip, User user, LocalDateTime date, Integer price, String payment_intent, Integer places) {
        this.trip = trip;
        this.user = user;
        this.date = date;
        this.price = price;
        this.payment_intent = payment_intent;
        this.places = places;
        this.status = "COMPLETED";
    }
}
