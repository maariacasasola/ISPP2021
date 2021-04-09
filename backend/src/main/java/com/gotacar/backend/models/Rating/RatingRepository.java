package com.gotacar.backend.models.Rating;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RatingRepository extends MongoRepository<Rating, String> {
    public Rating findById(ObjectId id);
}