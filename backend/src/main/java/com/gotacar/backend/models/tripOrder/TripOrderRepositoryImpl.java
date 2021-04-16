package com.gotacar.backend.models.tripOrder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public class TripOrderRepositoryImpl implements TripOrderRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public TripOrderRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<TripOrder> userHasMadeTrip(String userId, String tripId) {
        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        if (userId != null) {
            criteria.add(Criteria.where("user._id").is(userId));
        }

        if (tripId != null) {
            criteria.add(Criteria.where("trip._id").is(tripId));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        return mongoTemplate.find(query, TripOrder.class);
    }

    public TripOrder searchProcessingTripOrderByTripAndUser(String tripId, String userId) {

        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        if (tripId != null) {
            criteria.add(Criteria.where("trip._id").is(tripId));
        }

        if (userId != null) {
            criteria.add(Criteria.where("user._id").is(userId));
        }

        criteria.add(Criteria.where("status").is("PROCCESSING"));

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        return mongoTemplate.findOne(query, TripOrder.class);
    }

}
