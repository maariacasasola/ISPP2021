package com.gotacar.backend.models;

import java.util.Date;

import org.bson.codecs.pojo.annotations.BsonProperty;
import org.springframework.data.annotation.Id;

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

    public Integer price;

    public Date startDate;

    public Date endingDate;

    public Date cancelationDate;

    public String comments;

    public Integer places;

    public Boolean canceled;

    public User driver;

    public Trip(Location startingPoint, Location endingPoint, Integer price, Date startDate, Date endingDate,
            String comments, Integer places, User driver) {
        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;
        this.price = price;
        this.startDate = startDate;
        this.endingDate = endingDate;
        this.comments = comments;
        this.places = places;
        this.driver = driver;
    }

    @Override
    public String toString() {
        return String.format("Trip[id=%s]", id);
    }

}