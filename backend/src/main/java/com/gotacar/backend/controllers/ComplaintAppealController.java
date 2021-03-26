package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ComplaintAppealController {

    @Autowired
    private ComplaintAppealRepository complaintAppealRepository;

    @Autowired
    private UserRepository userRepository;

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
                u.setBannedUntil(null);
                userRepository.save(u);
                complaintAppeal.setChecked(true);
                complaintAppealRepository.save(complaintAppeal);
                return complaintAppeal;

            } else {
                throw new Exception("Esta apelación ya está resuelta");
            }

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.LOCKED, e.getMessage(), e);
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
            throw new ResponseStatusException(HttpStatus.LOCKED, e.getMessage(), e);
        }
    }
}
