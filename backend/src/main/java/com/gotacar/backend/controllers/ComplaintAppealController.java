package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.TripRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
            List<ComplaintAppeal> complaintAppeals = new ArrayList<>();

            complaintAppeals = complaintAppealRepository.findByChecked(false);

            return complaintAppeals;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

    @PostMapping("/complaint_appeals/{complaintAppealId}/accept")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ComplaintAppeal acceptComplaintAppeal(@PathVariable(value = "complaintAppealId") String complaintAppealId) {
        try {
            ObjectId complaintAppealObjectId = new ObjectId(complaintAppealId);
            ComplaintAppeal complaintAppeal = complaintAppealRepository.findById(complaintAppealObjectId);
            if (complaintAppeal.getChecked() == false) {
                User u = userRepository.findByUid(complaintAppeal.getComplaint().getTrip().getDriver().getUid());
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
            ObjectId complaintAppealObjectId = new ObjectId(complaintAppealId);
            ComplaintAppeal complaintAppeal = complaintAppealRepository.findById(complaintAppealObjectId);

            if (complaintAppeal.getChecked() == false) {
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
    @PostMapping(path = "/complaint_appeal", consumes = "application/json")
    public ComplaintAppeal complaintAppeal(@RequestBody() String body) {
        ComplaintAppeal appeal = new ComplaintAppeal();
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(authentication.getPrincipal().toString());
            List<String> trips = tripRepository.findAll().stream()
                    .filter(a -> a.driver.dni.equals(user.dni) && a.driver.bannedUntil != null).map(x -> x.getId())
                    .collect(Collectors.toList());
            int j = 0;
            List<Complaint> complaint = complaintRepository.findAll();
            Complaint res = new Complaint();
            while (j < complaint.size()) {
                if (trips.contains(complaint.get(j).getTrip().getId())
                        && complaint.get(j).getStatus().equals("ACCEPTED")) {
                    res = complaint.get(j);
                    break;
                }
                j++;
            }
            JsonNode jsonNode = objectMapper.readTree(body);
            String content = jsonNode.get("content").toString();
            Boolean checked = Boolean.parseBoolean(jsonNode.get("checked").toString());

            appeal.setComplaint(res);
            appeal.setContent(content);
            appeal.setChecked(checked);

            complaintAppealRepository.save(appeal);

            return appeal;

        } catch (Exception e) {
            throw (new IllegalArgumentException(e.getMessage()));
        }
       
    }
}
