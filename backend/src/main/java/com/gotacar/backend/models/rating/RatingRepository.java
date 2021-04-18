package com.gotacar.backend.models.rating;

import java.util.List;

import com.gotacar.backend.models.User;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RatingRepository extends MongoRepository<Rating, String>,RatingRepositoryCustom {
    public Rating findById(ObjectId id);

    public List<Rating> findByTo(User to);

    public List<Rating> findByFrom(User from);

    public List<Rating> findAll();
}
