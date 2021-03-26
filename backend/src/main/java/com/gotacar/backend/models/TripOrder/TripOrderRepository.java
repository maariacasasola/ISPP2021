package com.gotacar.backend.models.TripOrder;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TripOrderRepository extends MongoRepository<TripOrder, String>, TripOrderRepositoryCustom  {

    public Optional<TripOrder> findById(String id);

    public List<TripOrder> findByUserUid(String uid);
    
}
