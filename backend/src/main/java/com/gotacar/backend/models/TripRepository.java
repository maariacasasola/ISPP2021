package com.gotacar.backend.models;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.geo.Circle;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TripRepository extends MongoRepository<Trip, String> {
    public Trip findById(ObjectId id);

    public List<Trip> findAll();

    public List<Trip> findByStartingPointWithin(Circle c);
}
