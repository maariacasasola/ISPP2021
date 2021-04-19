package com.gotacar.backend.models;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplaintAppealRepository extends MongoRepository<ComplaintAppeal, String> {

    ComplaintAppeal findById(ObjectId id);

    List<ComplaintAppeal> findByChecked(boolean b);

    List<ComplaintAppeal> findByDriverId(String id);

    List<ComplaintAppeal> findByDriverIdAndChecked(String id, Boolean checked);

}
