package com.gotacar.backend.models.tripOrder;

import java.util.List;
import java.util.Optional;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.trip.Trip;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TripOrderRepository extends MongoRepository<TripOrder, String>, TripOrderRepositoryCustom {

    TripOrder findById(ObjectId id);

    List<TripOrder> findByUserUid(String uid);

    List<TripOrder> findByUserId(String id);

    List<TripOrder> findByTrip(Trip trip);

    public Optional<List<TripOrder>> findAllByTrip(Trip trip);

    List<TripOrder> findByUserAndStatus(User user, String status);
}
