package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepository;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
            return complaintRepository.findByStatus("PENDING");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PostMapping("/complaints/create")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public Complaint fileComplaint(@RequestBody String body) {
        try {
            ZonedDateTime actualDate = ZonedDateTime.now();
            actualDate = actualDate.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            JsonNode jsonNode = objectMapper.readTree(body);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(authentication.getPrincipal().toString());

            String tripId = objectMapper.readTree(jsonNode.get("tripId").toString()).asText();
            ObjectId tripObjectId = new ObjectId(tripId);
            Trip trip = tripRepository.findById(tripObjectId);

            List<TripOrder> lto = tripOrderRepository.userHasMadeTrip(user.getId(), tripId);

            if (trip.getEndingDate().isBefore(actualDate.toLocalDateTime())) {
                if (lto.size() == 1) {
                    String content = objectMapper.readTree(jsonNode.get("content").toString()).asText();
                    String title = objectMapper.readTree(jsonNode.get("title").toString()).asText();

                    Complaint complaint = new Complaint(title, content, trip, user, actualDate.toLocalDateTime());

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

    @PostMapping("/penalize")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public User penalize(@RequestBody String body) {
        try {
            JsonNode jsonNode = objectMapper.readTree(body);

            ZonedDateTime dateBannedJson = ZonedDateTime
                    .parse(objectMapper.readTree(jsonNode.get("date_banned").toString()).asText());
            dateBannedJson = dateBannedJson.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            LocalDateTime dateBanned = dateBannedJson.toLocalDateTime();

            String idComplaint = objectMapper.readTree(jsonNode.get("id_complaint").toString()).asText();
            Complaint complaintFinal = complaintRepository.findById(new ObjectId(idComplaint));
            Trip tripComplaint = complaintFinal.getTrip();
            User userBanned = tripComplaint.getDriver();

            List<String> tripsIds = tripRepository.findByDriverId(userBanned.getId()).stream().map(x -> x.getId())
                    .collect(Collectors.toList());
            List<Complaint> complaintAll = complaintRepository.findAll();

            int j = 0;
            while (j < complaintAll.size()) {
                if (tripsIds.contains(complaintAll.get(j).getTrip().getId())) {
                    complaintAll.get(j).setStatus("ALREADY_RESOLVED");
                    complaintRepository.save(complaintAll.get(j));
                }
                j++;
            }

            complaintFinal.setStatus("ACCEPTED");
            complaintRepository.save(complaintFinal);
            userBanned.setBannedUntil(dateBanned);
            userRepository.save(userBanned);
            return userBanned;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PostMapping("/refuse/{complaintId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Complaint refusedComplaint(@PathVariable(value = "complaintId") String complaintId) {
        try {
            Complaint complaintFinal = complaintRepository.findById(new ObjectId(complaintId));

            complaintFinal.setStatus("REFUSED");
            complaintRepository.save(complaintFinal);

            return complaintFinal;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

    @GetMapping("/complaints/check/{tripId}")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public Boolean checkComplaint(@PathVariable(value = "tripId") String tripId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(authentication.getPrincipal().toString());
            Trip trip = tripRepository.findById(tripId).get();
            
            System.out.println("CONTROLADORRRRRR "+complaintRepository.findByUserAndTrip(user.getId(), trip.getId()).size());
            return complaintRepository.findByUserAndTrip(user.getId(), trip.getId()).size() == 0;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

}
