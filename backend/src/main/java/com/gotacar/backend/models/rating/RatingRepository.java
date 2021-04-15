package com.gotacar.backend.models.rating;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RatingRepository extends MongoRepository<Rating, String>,RatingRepositoryCustom {
    public Rating findById(ObjectId id);
}
