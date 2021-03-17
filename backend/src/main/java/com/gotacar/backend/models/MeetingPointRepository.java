package com.gotacar.backend.models;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MeetingPointRepository extends MongoRepository<MeetingPoint, String> {
    public MeetingPoint findByName(String name);
}