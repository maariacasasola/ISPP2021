package com.gotacar.backend.models.trip;

import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.Future;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.tripOrder.TripOrder;

import org.bson.codecs.pojo.annotations.BsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Trip {
    @Id
    public String id;

    @BsonProperty("starting_point")
    public Location startingPoint;

    @BsonProperty("ending_pont")
    public Location endingPoint;

    @NotNull
    @Min(50)
    public Integer price;

    @Future
    @NotNull
    public LocalDateTime startDate;

    @Future
    public LocalDateTime endingDate;

    private LocalDateTime cancelationDate;

    private LocalDateTime cancelationDateLimit;

    @NotBlank
    public String comments;

    @NotNull
    @Max(4)
    public Integer places;

    private Boolean canceled;

    @DBRef
    public User driver;

    @DBRef
    public List<TripOrder> tripOrders;

    public Trip() {
        this.canceled = false;
    }

    public Trip(Location startingPoint, Location endingPoint, Integer price, LocalDateTime startDate,
            LocalDateTime endingDate, String comments, Integer places, User driver) {

        LocalDateTime cancelDateLimit = startDate.minusMinutes(30);

        this.setCancelationDateLimit(cancelDateLimit);

        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;
        this.price = price;
        this.startDate = startDate;
        this.endingDate = endingDate;
        this.comments = comments;
        this.places = places;
        this.driver = driver;
        this.canceled = false;
    }

    @Override
    public String toString() {
        return String.format("Trip[id=%s]", id);
    }

}