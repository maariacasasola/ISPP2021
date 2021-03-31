package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.util.List;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class TripOrderController {

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @RequestMapping("/list_trip_orders")
    public List<TripOrder> listTripOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getPrincipal().toString());
        try {
            return tripOrderRepository.findByUserUid(user.getUid());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @RequestMapping("/cancel_trip_order_request/{id}")
    public TripOrder cancelTripOrderRequest(@PathVariable(value = "id") String id) {
        try {
            ObjectId tripOrderObjectId = new ObjectId(id);
            TripOrder tripOrder = tripOrderRepository.findById(tripOrderObjectId);
            Trip trip = tripOrder.getTrip();
            if(trip.getCancelationDateLimit().isAfter(LocalDateTime.now())) {
                tripOrder.setStatus("REFUNDED_PENDING");
                tripOrderRepository.save(tripOrder);
            }
            return tripOrder;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping("/cancel_trip_order/{id}")
    public TripOrder cancelTripOrder(@PathVariable(value = "id") String id) {
        try {
            ObjectId tripOrderObjectId = new ObjectId(id);
            TripOrder tripOrder = tripOrderRepository.findById(tripOrderObjectId);
            tripOrder.setStatus("REFUNDED");
            tripOrderRepository.save(tripOrder);
            return tripOrder;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

}
