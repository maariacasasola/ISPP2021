package com.gotacar.backend.controllers;

import java.time.LocalDateTime;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;
import com.stripe.model.checkout.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class TripOrderController {

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create_trip_order/{sessionId}")
    public @ResponseBody TripOrder createTripOrder(@PathVariable(value = "sessionId") String sessionId) {
        
        try{
            Session session = Session.retrieve(sessionId);
            String tripId = session.getMetadata().values().toArray()[0].toString();
            String userId = session.getMetadata().values().toArray()[1].toString();            
            LocalDateTime date = LocalDateTime.now();
            Integer price = session.getAmountTotal().intValue();
            String paymentIntent = session.getPaymentIntent();
            System.out.println(session);
            Integer quantity = session.getLineItems().getData().get(1).toString().length();
            Trip trip = tripRepository.findById(tripId).get();
            User user = userRepository.findById(userId).get();    
                    
            Integer places = trip.getPlaces();
            if (places > quantity) {
                places = places - quantity;
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El viaje no se ha pagado todavía");
            }
            try {
                session.getPaymentStatus().equals("paid");
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El viaje no se ha pagado todavía", e);
            }
            TripOrder res = new TripOrder(trip, user, date, price, paymentIntent, places);

            tripOrderRepository.save(res);

            return res;

        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
            
    }
    
}
