package com.gotacar.backend.models;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TripRepository extends MongoRepository<Trip, String> {
    public Trip findById(ObjectId id);
}
