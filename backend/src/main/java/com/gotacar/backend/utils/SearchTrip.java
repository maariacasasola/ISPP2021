package com.gotacar.backend.utils;

import java.time.LocalDateTime;

import javax.validation.Valid;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;

import com.gotacar.backend.models.Location;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchTrip {

    @Valid
    @NotNull
    public Location startingPoint;
    
    @Valid
    @NotNull
    public Location endingPoint;

    @Future
    @NotNull
    public LocalDateTime date;

    @NotNull
    public Integer places;

    public SearchTrip(Location sp, Location ep, LocalDateTime d, Integer p){
        this.startingPoint = sp;
        this.endingPoint = ep;
        this.date = d;
        this.places = p;
    }

    @Override
    public String toString() {
        return String.format("SearchTrip[Start=%s, End=%s, Date=%s, Places=%s]", this.startingPoint.name, this.endingPoint.name, this.date.toString(), String.valueOf(this.places));
    }

}
