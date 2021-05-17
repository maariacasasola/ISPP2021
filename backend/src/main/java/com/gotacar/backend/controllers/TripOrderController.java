package com.gotacar.backend.controllers;

import java.util.List;

import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.trip.TripRepository;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class TripOrderController {

    @Autowired
    private RefundController refundController;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @GetMapping("/list_trip_orders")
    public List<TripOrder> listTripOrders() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            var user = userRepository.findByEmail(authentication.getPrincipal().toString());
            return tripOrderRepository.findByUserId(user.getId());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @PostMapping("/cancel_trip_order_request/{id}")
    public TripOrder cancelTripOrderRequest(@PathVariable(value = "id") String id) {
        try {
            var tripOrder = tripOrderRepository.findById(new ObjectId(id));
            var trip = tripOrder.getTrip();
            refundController.createRefundClientCancel(tripOrder);
            trip.setPlaces(trip.getPlaces() + tripOrder.getPlaces());
            tripRepository.save(trip);
            return tripOrder;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/cancel_trip_order/{id}")
    public TripOrder cancelTripOrder(@PathVariable(value = "id") String id) {
        try {
            var tripOrder = tripOrderRepository.findById(new ObjectId(id));
            tripOrder.setStatus("REFUNDED");
            tripOrderRepository.save(tripOrder);
            return tripOrder;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("trip_order/list")
    public List<TripOrder> listTripOrdersAdmin() {
        try {
            return tripOrderRepository.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("trip_order/show/{id}")
    public TripOrder showTripOrdersAdmin(@PathVariable(value = "id") String id) {
        try {
            return tripOrderRepository.findById(new ObjectId(id));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

}
