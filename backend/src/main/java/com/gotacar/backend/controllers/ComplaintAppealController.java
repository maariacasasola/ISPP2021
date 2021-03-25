package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ComplaintAppealController {

    @Autowired
    private ComplaintAppealRepository complaintAppealRepository;

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

}
