package com.gotacar.backend.models;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplaintRepository extends MongoRepository<Complaint, String>{
	
}
