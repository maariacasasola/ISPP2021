package com.gotacar.backend.models.trip;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

public class TripRepositoryImpl implements TripRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public TripRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<Trip> searchTrips(Point startingPoint, Point endindPoint, Integer places, LocalDateTime date) {
        Circle circleStart = new Circle(startingPoint, 0.012);
        Circle circleEnd = new Circle(endindPoint, 0.012);

        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        LocalDateTime nextDay = date.plusDays(2);

        if (startingPoint != null) {
            criteria.add(Criteria.where("startingPoint").within(circleStart));
        }

        if (places != null) {
            criteria.add(Criteria.where("places").gte(places));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        criteria.add(Criteria.where("startDate").gte(date).lte(nextDay));

        List<Trip> viajesPuntoEmpezar = mongoTemplate.find(query, Trip.class);

        query = new Query();
        criteria = new ArrayList<>();

        List<String> ids = viajesPuntoEmpezar.stream().map(x -> x.getId()).collect(Collectors.toList());

        criteria.add(Criteria.where("id").in(ids));

        if (endindPoint != null) {
            criteria.add(Criteria.where("endingPoint").within(circleEnd));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[criteria.size()])));
        }

        return mongoTemplate.find(query, Trip.class);
    }

}
