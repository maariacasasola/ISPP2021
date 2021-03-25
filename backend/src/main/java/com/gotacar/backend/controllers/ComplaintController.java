package com.gotacar.backend.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @Autowired
    private UserRepository userRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/complaints/create")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public Complaint fileComplaint(@RequestBody String body) {
        Complaint c = new Complaint();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);

            String tripId = objectMapper.readTree(jsonNode.get("tripId").toString()).asText();
            ObjectId id = new ObjectId(tripId); 
            
            Trip t = tripRepository.findById(id);

            if (t.getEndingDate().isBefore(LocalDateTime.now())) {

            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return c;
    }

}
