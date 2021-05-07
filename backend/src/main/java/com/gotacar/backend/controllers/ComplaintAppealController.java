package com.gotacar.backend.controllers;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.complaint.Complaint;
import com.gotacar.backend.models.complaint.ComplaintRepository;
import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ComplaintAppealController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintAppealRepository complaintAppealRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/complaint_appeals/list")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<ComplaintAppeal> listComplaintAppeals() {
        try {
            return complaintAppealRepository.findByChecked(false);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PostMapping("/complaint_appeals/{complaintAppealId}/accept")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ComplaintAppeal acceptComplaintAppeal(@PathVariable(value = "complaintAppealId") String complaintAppealId) {
        try {
            var complaintAppeal = complaintAppealRepository.findById(new ObjectId(complaintAppealId));
            if (!(complaintAppeal.getChecked() == false)) {
                var u = userRepository.findByUid(complaintAppeal.getDriver().getUid());
                complaintAppeal.getComplaint().getTrip().setDriver(u);
                u.setBannedUntil(null);
                userRepository.save(u);
                complaintAppeal.setChecked(true);
                complaintAppealRepository.save(complaintAppeal);
                return complaintAppeal;
            } else {
                throw new Exception("Esta apelación ya está resuelta");
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PostMapping("/complaint_appeals/{complaintAppealId}/reject")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ComplaintAppeal rejectComplaintAppeal(@PathVariable(value = "complaintAppealId") String complaintAppealId) {
        try {
            var complaintAppeal = complaintAppealRepository.findById(new ObjectId(complaintAppealId));
            if (!(complaintAppeal.getChecked() == false)) {
                complaintAppeal.setChecked(true);
                complaintAppealRepository.save(complaintAppeal);
                return complaintAppeal;
            } else {
                throw new Exception("Esta apelación ya está resuelta");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping(path = "/complaint-appeal/complaint/create", consumes = "application/json")
    public ComplaintAppeal complaintAppealByComplaint(@RequestBody() String body) {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            var user = userRepository.findByEmail(authentication.getPrincipal().toString());
            List<String> trips = tripRepository.findAll().stream()
                    .filter(a -> a.driver.dni.equals(user.dni) && a.driver.bannedUntil != null).map(x -> x.getId())
                    .collect(Collectors.toList());
            var j = 0;
            List<Complaint> complaints = complaintRepository.findAll();
            var res = new Complaint();
            if (!complaints.isEmpty()) {
                complaints = complaints.stream().filter(c -> c.getTrip().getDriver().getId() == user.getId())
                        .collect(Collectors.toList());
                if (!complaints.isEmpty()) {
                    while (j < complaints.size()) {
                        if (trips.contains(complaints.get(j).getTrip().getId())
                                && complaints.get(j).getStatus().equals("ACCEPTED")) {
                            res = complaints.get(j);
                            break;
                        }
                        j++;
                    }
                } else {
                    var dateCreateZone = ZonedDateTime.now();
                    dateCreateZone = dateCreateZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
                    List<Trip> tripsList = tripRepository.findByDriverId(user.getId());
                    var complaint = new Complaint("Baneado por límite de cancelación",
                            "Usuario baneado por cancelar un viaje una vez se ha superado el límite de cancelación",
                            tripsList.get(tripsList.size() - 1), user, dateCreateZone.toLocalDateTime(),
                            "ALREADY_RESOLVED");
                    complaintRepository.save(complaint);
                    res = complaint;
                }
            }
            var jsonNode = objectMapper.readTree(body);
            String content = jsonNode.get("content").asText();

            var appeal = new ComplaintAppeal(content, false, res, user);

            complaintAppealRepository.save(appeal);

            return appeal;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping(path = "/complaint-appeal/create", consumes = "application/json")
    public ComplaintAppeal complaintAppeal(@RequestBody() String body) {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            var user = userRepository.findByEmail(authentication.getPrincipal().toString());
            var jsonNode = objectMapper.readTree(body);
            String content = jsonNode.get("content").asText();
            String tripId = jsonNode.get("tripId").asText();

            var trip = this.tripRepository.findById(new ObjectId(tripId));

            if (trip.getDriver().getId().equals(user.getId())) {
                var dateCreateZone = ZonedDateTime.now();
                dateCreateZone = dateCreateZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));

                var complaint = new Complaint("Baneado por límite de cancelación",
                        "Usuario baneado por cancelar un viaje una vez se ha superado el límite de cancelación", trip,
                        user, dateCreateZone.toLocalDateTime(), "ALREADY_RESOLVED");
                complaintRepository.save(complaint);
                var appeal = new ComplaintAppeal(content, false, complaint, user);

                complaintAppealRepository.save(appeal);

                return appeal;
            } else {
                throw new Exception("El conductor no ha ofertado este viaje");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
    }

    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @GetMapping(path = "/complaint-appeal/driver/check")
    public Boolean complaintAppealCreated() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            var user = userRepository.findByEmail(authentication.getPrincipal().toString());

            List<ComplaintAppeal> appeals = complaintAppealRepository.findByDriverIdAndChecked(user.getId(), false);

            if (appeals.isEmpty()) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
    }
}