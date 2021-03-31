package com.gotacar.backend.models.Trip;

import java.time.LocalDateTime;

import javax.validation.constraints.Future;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;

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

    @Max(400)
    @NotNull
    public Integer price;

    @Future
    @NotNull
    public LocalDateTime startDate;

    @Future
    public LocalDateTime endingDate;

    public LocalDateTime cancelationDate;
    
    public LocalDateTime cancelationDateLimit;

    public String comments;

    @NotNull
    @Max(4)
    public Integer places;

    public Boolean canceled;

    public User driver;
    
    public Trip() {
        this.canceled = false;
    }

    public Trip(Location startingPoint, Location endingPoint, Integer price, LocalDateTime startDate, LocalDateTime endingDate,
            String comments, Integer places, User driver) {
    	
    	LocalDateTime cancelationDateLimit = startDate.minusHours(1);
        
        this.setCancelationDateLimit(cancelationDateLimit);
    	
    	
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

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((cancelationDate == null) ? 0 : cancelationDate.hashCode());
        result = prime * result + ((canceled == null) ? 0 : canceled.hashCode());
        result = prime * result + ((comments == null) ? 0 : comments.hashCode());
        result = prime * result + ((driver == null) ? 0 : driver.hashCode());
        result = prime * result + ((endingDate == null) ? 0 : endingDate.hashCode());
        result = prime * result + ((endingPoint == null) ? 0 : endingPoint.hashCode());
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((places == null) ? 0 : places.hashCode());
        result = prime * result + ((price == null) ? 0 : price.hashCode());
        result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
        result = prime * result + ((startingPoint == null) ? 0 : startingPoint.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Trip other = (Trip) obj;
        if (cancelationDate == null) {
            if (other.cancelationDate != null)
                return false;
        } else if (!cancelationDate.equals(other.cancelationDate))
            return false;
        if (canceled == null) {
            if (other.canceled != null)
                return false;
        } else if (!canceled.equals(other.canceled))
            return false;
        if (comments == null) {
            if (other.comments != null)
                return false;
        } else if (!comments.equals(other.comments))
            return false;
        if (driver == null) {
            if (other.driver != null)
                return false;
        } else if (!driver.equals(other.driver))
            return false;
        if (endingDate == null) {
            if (other.endingDate != null)
                return false;
        } else if (!endingDate.equals(other.endingDate))
            return false;
        if (endingPoint == null) {
            if (other.endingPoint != null)
                return false;
        } else if (!endingPoint.equals(other.endingPoint))
            return false;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (places == null) {
            if (other.places != null)
                return false;
        } else if (!places.equals(other.places))
            return false;
        if (price == null) {
            if (other.price != null)
                return false;
        } else if (!price.equals(other.price))
            return false;
        if (startDate == null) {
            if (other.startDate != null)
                return false;
        } else if (!startDate.equals(other.startDate))
            return false;
        if (startingPoint == null) {
            if (other.startingPoint != null)
                return false;
        } else if (!startingPoint.equals(other.startingPoint))
            return false;
        return true;
    }

}