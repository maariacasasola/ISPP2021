package com.gotacar.backend.models.TripOrder;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
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
    public List<TripOrder> userHasMadeTrip(ObjectId userId, ObjectId tripId) {
        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        if (userId != null) {
            criteria.add(Criteria.where("user.id").is(userId));
        }

        if (tripId != null) {
            criteria.add(Criteria.where("trip.id").is(tripId));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        return mongoTemplate.find(query, TripOrder.class);
    }
}
