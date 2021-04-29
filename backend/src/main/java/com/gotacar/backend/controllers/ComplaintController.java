package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.complaint.Complaint;
import com.gotacar.backend.models.complaint.ComplaintRepository;
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
            var actualDate = ZonedDateTime.now();
            actualDate = actualDate.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            var jsonNode = objectMapper.readTree(body);
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            var user = userRepository.findByEmail(authentication.getPrincipal().toString());

            String tripId = objectMapper.readTree(jsonNode.get("tripId").toString()).asText();
            var tripObjectId = new ObjectId(tripId);
            var trip = tripRepository.findById(tripObjectId);

            List<TripOrder> lto = tripOrderRepository.userHasMadeTrip(user.getId(), tripId);

            if (trip.getEndingDate().isBefore(actualDate.toLocalDateTime())) {
                if (lto.size() == 1) {
                    String content = objectMapper.readTree(jsonNode.get("content").toString()).asText();
                    String title = objectMapper.readTree(jsonNode.get("title").toString()).asText();

                    var complaint = new Complaint(title, content, trip, user, actualDate.toLocalDateTime());

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
            var jsonNode = objectMapper.readTree(body);

            var dateBannedJson = ZonedDateTime
                    .parse(objectMapper.readTree(jsonNode.get("date_banned").toString()).asText());
            dateBannedJson = dateBannedJson.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
            var dateBanned = dateBannedJson.toLocalDateTime();

            String idComplaint = objectMapper.readTree(jsonNode.get("id_complaint").toString()).asText();
            var complaintFinal = complaintRepository.findById(new ObjectId(idComplaint));
            var tripComplaint = complaintFinal.getTrip();
            var userBanned = tripComplaint.getDriver();

            List<String> tripsIds = tripRepository.findByDriverId(userBanned.getId()).stream().map(x -> x.getId())
                    .collect(Collectors.toList());
            List<Complaint> complaintAll = complaintRepository.findAll();

            var j = 0;
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
            var complaintFinal = complaintRepository.findById(new ObjectId(complaintId));

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
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            var user = userRepository.findByEmail(authentication.getPrincipal().toString());
            var trip = tripRepository.findById(new ObjectId(tripId));
            return complaintRepository.findByUserAndTrip(user.getId(), trip.getId()).size() == 0;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }

    }

    @GetMapping("/complaint/last/{driverUid}")
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    public Complaint lastComplaint(@PathVariable(value = "driverUid") String driverUid) {
        try {
            List<Complaint> complaints = complaintRepository.findByStatus("ACCEPTED");
            if (!complaints.isEmpty()) {
                complaints = complaints.stream().filter(c -> c.getTrip().getDriver().getUid().equals(driverUid))
                        .collect(Collectors.toList());
                Collections.sort(complaints, (x, y) -> x.creationDate.compareTo(y.creationDate));
                var c = complaints.get(complaints.size() - 1);
                return c;
            }else{
                throw new Exception("Este conductor no tiene quejas");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

}
