package com.gotacar.backend.models;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplaintAppealRepository extends MongoRepository<ComplaintAppeal, String> {

    List<ComplaintAppeal> findByChecked(boolean b);

}
