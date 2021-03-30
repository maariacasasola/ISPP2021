package com.gotacar.backend.models.TripOrder;

import java.util.List;

import com.gotacar.backend.models.Trip.Trip;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TripOrderRepository extends MongoRepository<TripOrder, String>, TripOrderRepositoryCustom  {
    
    TripOrder findById(ObjectId id);

    List<TripOrder> findByUserUid(String uid);

    List<TripOrder> findByTrip(Trip trip);
    
}
