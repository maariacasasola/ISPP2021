package com.gotacar.backend.models.rating;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.deser.DataFormatReaders.Match;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;



public class RatingRepositoryImpl implements RatingRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Autowired
    public RatingRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Integer findAverageById(ObjectId id) {
        MatchOperation match = new MatchOperation(new Criteria("to._id").is(id));
        System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+match);
        GroupOperation group = Aggregation.group("id").avg("points").as("averagePoints");
        System.out.println("BBBBBBBBBBBBBBBBBBBBBBBBB"+group);
        Aggregation aggregation = Aggregation.newAggregation(match,group);
        System.out.println("CCCCCCCCCCCCCCCCCCCCCC"+aggregation);
        System.out.println(mongoTemplate.aggregate(aggregation,Rating.class, Integer.class).getRawResults());
        return 0;
    }

  

}
