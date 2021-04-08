package com.gotacar.backend.models.Rating;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.gotacar.backend.models.User;

public interface RatingRepository extends MongoRepository<Rating, String> {
    public Rating findById(ObjectId id);
    public List<Rating> findByTo(User to);
}
