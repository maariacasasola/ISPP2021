package com.gotacar.backend.models.TripOrders;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TripOrderRepository extends MongoRepository<TripOrder, String> {

    public Optional<TripOrder> findById(String id);

}
