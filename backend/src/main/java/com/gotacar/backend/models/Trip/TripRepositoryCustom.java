package com.gotacar.backend.models.Trip;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.geo.Point;


public interface TripRepositoryCustom {
    List<Trip> searchTrips(Point startingPoint, Point endindPoint, Integer places, LocalDateTime date);
}
