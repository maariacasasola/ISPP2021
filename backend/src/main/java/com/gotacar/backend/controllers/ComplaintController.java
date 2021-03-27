package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

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
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;

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

    @GetMapping("/complaints/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Complaint> listComplaints() {
        try {
            List<Complaint> complaints = new ArrayList<>();

            complaints = complaintRepository.findAll();
            
            return complaints;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PostMapping("/complaints/create")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public Complaint fileComplaint(@RequestBody String body) {

        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(authentication.getPrincipal().toString());

            String tripId = objectMapper.readTree(jsonNode.get("tripId").toString()).asText();
            ObjectId tripObjectId = new ObjectId(tripId);
            Trip trip = tripRepository.findById(tripObjectId);

            List<TripOrder> lto = tripOrderRepository.userHasMadeTrip(new ObjectId(user.getId()), tripObjectId);

            if (trip.getEndingDate().isBefore(LocalDateTime.now())) {
                if (lto.size() == 1) {
                    String content = objectMapper.readTree(jsonNode.get("content").toString()).asText();
                    String title = objectMapper.readTree(jsonNode.get("title").toString()).asText();

                    Complaint complaint = new Complaint(title, content, trip, user, LocalDateTime.now());

                    this.complaintRepository.save(complaint);

                    return complaint;
                } else {
                    throw new Exception("Usted no ha realizado este viaje");
                }
            } else {
                throw new Exception("El viaje aún no se ha realizado");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

}
