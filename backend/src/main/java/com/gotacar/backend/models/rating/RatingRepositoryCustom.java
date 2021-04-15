package com.gotacar.backend.models.rating;

import org.bson.types.ObjectId;


public interface RatingRepositoryCustom {
    public Rating findAverageById(ObjectId id);
    
}
