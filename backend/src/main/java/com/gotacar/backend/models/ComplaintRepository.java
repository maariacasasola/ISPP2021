package com.gotacar.backend.models;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplaintRepository extends MongoRepository<Complaint, String>{
	public Optional<Complaint> findById(String id);
}
