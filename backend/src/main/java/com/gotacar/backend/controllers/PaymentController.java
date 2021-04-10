package com.gotacar.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PaymentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripOrderRepository tripOrderRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @Value("${STRIPE_API_KEY:sk_test_51I0FjpJ65m70MT01alImpvRuOOYBczw0EVZmF2oMlA5WbWNjOkqbIz0ty1IZXWNnAWe3F4xnozb8I4g3I4JDfJd500W5tuKdUh}")
    private String stripeApiKey;

    @Value("${STRIPE_WEBHOOK_SECRET:whsec_KSifoaJEJjt7CGRh1cjSFKNCVMxmY7eR}")
    private String stripeWebhookSecret;

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @PostMapping("/create_session")
    public Map<String, Object> createSession(@RequestBody() String body) {
        Stripe.apiKey = stripeApiKey;

        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            Integer quantity = objectMapper.readTree(jsonNode.get("quantity").toString()).asInt();
            String description = objectMapper.readTree(jsonNode.get("description").toString()).asText();
            String idTrip = objectMapper.readTree(jsonNode.get("idTrip").toString()).asText();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String idUser = userRepository.findByEmail(authentication.getPrincipal().toString()).getId();
            Trip trip = tripRepository.findById(new ObjectId(idTrip));

            if (!(trip.getPlaces() >= quantity)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El viaje no tiene tantas plazas");
            }

            List<Object> paymentMethodTypes = new ArrayList<>();
            paymentMethodTypes.add("card");
            List<Object> lineItems = new ArrayList<>();
            Map<String, Object> lineItem1 = new HashMap<>();
            lineItem1.put("amount", trip.getPrice());
            lineItem1.put("quantity", quantity);
            lineItem1.put("currency", "EUR");
            lineItem1.put("name", description);
            lineItems.add(lineItem1);
            Map<String, Object> params = new HashMap<>();
            params.put("success_url", "https://gotacar.es/payment-success");
            params.put("cancel_url", "https://gotacar.es/payment-failed");
            params.put("payment_method_types", paymentMethodTypes);
            params.put("line_items", lineItems);
            params.put("mode", "payment");
            params.put("locale", "es");
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("userId", idUser);
            metadata.put("tripId", idTrip);
            metadata.put("quantity", quantity);
            metadata.put("amount", trip.getPrice());
            metadata.put("currency", "EUR");
            metadata.put("name", description);
            params.put("metadata", metadata);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("session_id", Session.create(params).getId());

            return response;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PostMapping("/stripe-webhook")
    public ResponseEntity<String> handle(@RequestBody() String body,
            @RequestHeader("Stripe-Signature") String signHeader) {
        Event event = null;

        try {
            // TODO: Configurar secret de stripe webhook
            event = Webhook.constructEvent(body, signHeader, stripeWebhookSecret);
        } catch (Exception e) {
            return new ResponseEntity<String>("", HttpStatus.BAD_REQUEST);
        }

        switch (event.getType()) {
        case "checkout.session.completed":
            Session session = (Session) event.getDataObjectDeserializer().getObject().get();
            // Save an order in your database, marked as 'awaiting payment'
            createTripOrder(session);
            // Check if the order is paid (e.g., from a card payment)
            // A delayed notification payment will have an `unpaid` status, as
            // you're still waiting for funds to be transferred from the customer's
            // account.
            if (session.getPaymentStatus().equals("paid")) {
                // Fulfill the purchase
                fulfillOrder(session);
            }

            break;
        case "checkout.session.async_payment_succeeded":
            Session session_succeeded = (Session) event.getDataObjectDeserializer().getObject().get();
            fulfillOrder(session_succeeded);
            break;
        case "checkout.session.async_payment_failed":
            // TODO: Sé que no se usa, me falta gestionar un evento
            Session session_failed = (Session) event.getDataObjectDeserializer().getObject().get();
            // Send an email to the customer asking them to retry their order
            // emailCustomerAboutFailedPayment(session);
            break;
        }
        return new ResponseEntity<String>("", HttpStatus.OK);
    }

    public void fulfillOrder(Session session) {
        String tripId = session.getMetadata().values().toArray()[3].toString();
        String userId = session.getMetadata().values().toArray()[5].toString();
        TripOrder pendingTripOrder = tripOrderRepository.searchProcessingTripOrderByTripAndUser(tripId, userId);
        pendingTripOrder.setStatus("PAID");
        tripOrderRepository.save(pendingTripOrder);
    }

    public void createTripOrder(Session session) {
        try {
            String tripId = session.getMetadata().values().toArray()[3].toString();
            String userId = session.getMetadata().values().toArray()[5].toString();
            LocalDateTime date = LocalDateTime.now();
            Integer price = session.getAmountTotal().intValue();
            String paymentIntent = session.getPaymentIntent();
            Integer quantity = Integer.parseInt(session.getMetadata().values().toArray()[1].toString());
            Trip trip = tripRepository.findById(new ObjectId(tripId));
            User user = userRepository.findById(new ObjectId(userId));
            Integer places = trip.getPlaces();

            if (places >= quantity) {
                places = places - quantity;
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El viaje no tiene tantas plazas");
            }

            TripOrder res = new TripOrder(trip, user, date, price, paymentIntent, quantity);
            tripOrderRepository.save(res);
            trip.setPlaces(places);
            tripRepository.save(trip);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
