package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {
    
    private static ObjectMapper objectMapper = new ObjectMapper();

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @PostMapping("/create_session")
    // @JsonSerialize
    public Session createSession(@RequestBody() String body) {
        
        Session res = new Session();

        try { 
            // objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            JsonNode jsonNode = objectMapper.readTree(body);
            
            Integer amount = objectMapper.readTree(jsonNode.get("amount").toString()).asInt();
            Integer quantity = objectMapper.readTree(jsonNode.get("quantity").toString()).asInt();
            String description = objectMapper.readTree(jsonNode.get("amount").toString()).asText();
            String idUser = objectMapper.readTree(jsonNode.get("idUser").toString()).asText();
            String idTrip = objectMapper.readTree(jsonNode.get("idTrip").toString()).asText();

            Stripe.apiKey = "sk_test_4eC39HqLyjWDarjtT1zdp7dc";        
            
            List<Object> paymentMethodTypes = new ArrayList<>();
            paymentMethodTypes.add("card");
            List<Object> lineItems = new ArrayList<>();
            Map<String, Object> lineItem1 = new HashMap<>();
            lineItem1.put("amount", amount);
            lineItem1.put("quantity", quantity);
            lineItem1.put("currency", "EUR");
            lineItem1.put("name", description);
            lineItems.add(lineItem1);
            Map<String, Object> params = new HashMap<>();
            params.put(
            "success_url",
            "https://localhost:8081/success"
            );
            params.put(
            "cancel_url",
            "https://localhost:8081/cancel"
            );
            params.put(
            "payment_method_types",
            paymentMethodTypes
            );
            params.put("line_items", lineItems);
            params.put("mode", "payment");
            params.put("locale", "es");
            Map<String, String> metadata = new HashMap<>();
            metadata.put("userId", idUser);
            metadata.put("tripId", idTrip);
            params.put("metadata",metadata);
            
            res = Session.create(params);
        
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    return res;
    }
}
