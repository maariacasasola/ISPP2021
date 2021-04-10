package com.gotacar.backend.models;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface UserRepository extends MongoRepository<User, String> {
    public User findById(ObjectId id);

    public User findByFirstName(String firstName);

    public User findByUid(String uid);

    public User findByEmail(String email);

    public List<User> findByLastName(String lastName);

    public List<User> findByDriverStatus(String status);
    
    public List<User> findByRolesContaining(String role);
}
