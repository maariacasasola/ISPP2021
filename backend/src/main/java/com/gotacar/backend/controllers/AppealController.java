package com.gotacar.backend.controllers;


import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
public class AppealController {
    

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintAppealRepository complaintAppealRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping(path = "/complaint_appeal", consumes = "application/json")
    public ComplaintAppeal complaintAppeal(@RequestBody() String body) {
        ComplaintAppeal appeal = new ComplaintAppeal();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            JsonNode complaintJson = objectMapper.readTree(jsonNode.get("complaint").toString());
            Complaint complaint = complaintRepository.findById(complaintJson.get("id").asText()).orElseGet(()->null);
            
            String content = jsonNode.get("content").toString();
            Boolean checked = Boolean.parseBoolean(jsonNode.get("checked").toString());
            
            appeal.setComplaint(complaint);
            appeal.setContent(content);
            appeal.setChecked(checked);

            complaintAppealRepository.save(appeal);
               
        }catch(Exception e){
            throw(new IllegalArgumentException(e.getMessage()));
        }
        return appeal;
    }

}
