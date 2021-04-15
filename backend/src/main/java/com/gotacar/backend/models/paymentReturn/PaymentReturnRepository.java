package com.gotacar.backend.models.paymentReturn;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentReturnRepository extends MongoRepository<PaymentReturn, String> {
    
}