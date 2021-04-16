package com.gotacar.backend.models.trip;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.geo.Circle;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.gotacar.backend.models.User;

public interface TripRepository extends MongoRepository<Trip, String>, TripRepositoryCustom {
    public Trip findById(ObjectId id);

    public Optional<Trip> findById(String id);

    public List<Trip> findAll();

    public List<Trip> findByStartingPointWithin(Circle c);

    public List<Trip> findByEndingPointWithin(Circle c);
    
    public List<Trip> findByDriver(User driver);

    List<Trip> findByDriverAndCanceled(User driver, Boolean canceled);

    public List<Trip> findByDriverId(String id);
}
