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
            String tripId = session.getMetadata().values().toArray()[3].toString();
            String userId = session.getMetadata().values().toArray()[5].toString();            
            LocalDateTime date = LocalDateTime.now();
            Integer price = session.getAmountTotal().intValue();
            String paymentIntent = session.getPaymentIntent();
            Integer quantity = Integer.parseInt(session.getMetadata().values().toArray()[1].toString());
            Trip trip = tripRepository.findById(tripId).get();
            User user = userRepository.findById(userId).get();    
                    
            Integer places = trip.getPlaces();
            if (places >= quantity) {
                places = places - quantity;
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El viaje no tiene tantas plazas");
            }

            // if (!session.getPaymentStatus().equals("paid")){
            //     throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El viaje no se ha pagado todavía", e);
            // }
        
            TripOrder res = new TripOrder(trip, user, date, price, paymentIntent, quantity);

            tripOrderRepository.save(res);
            trip.setPlaces(places);
            tripRepository.save(trip);

            return res;

        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
            
    }
    
}
