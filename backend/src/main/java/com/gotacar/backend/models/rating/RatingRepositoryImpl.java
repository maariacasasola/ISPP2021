package com.gotacar.backend.models.rating;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.mongodb.core.MongoTemplate;

public class RatingRepositoryImpl implements RatingRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public RatingRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Rating findAverageById(ObjectId id) {
      return null;
    }

  

}
