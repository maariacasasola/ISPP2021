package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class PaymentController {

    private static ObjectMapper objectMapper = new ObjectMapper();

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @PostMapping("/create_session")
    public String createSession(@RequestBody() String body) {
        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            Integer amount = objectMapper.readTree(jsonNode.get("amount").toString()).asInt();
            Integer quantity = objectMapper.readTree(jsonNode.get("quantity").toString()).asInt();
            String description = objectMapper.readTree(jsonNode.get("description").toString()).asText();
            String idUser = objectMapper.readTree(jsonNode.get("idUser").toString()).asText();
            String idTrip = objectMapper.readTree(jsonNode.get("idTrip").toString()).asText();

            // TODO: Añadir como variable de entorno
            Stripe.apiKey = "sk_test_51I0FjpJ65m70MT01alImpvRuOOYBczw0EVZmF2oMlA5WbWNjOkqbIz0ty1IZXWNnAWe3F4xnozb8I4g3I4JDfJd500W5tuKdUh";

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
            params.put("success_url", "http://localhost:4200");
            params.put("cancel_url", "http://localhost:4200");
            params.put("payment_method_types", paymentMethodTypes);
            params.put("line_items", lineItems);
            params.put("mode", "payment");
            params.put("locale", "es");
            Map<String, String> metadata = new HashMap<>();
            metadata.put("userId", idUser);
            metadata.put("tripId", idTrip);
            params.put("metadata", metadata);

            return Session.create(params).getId();

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
