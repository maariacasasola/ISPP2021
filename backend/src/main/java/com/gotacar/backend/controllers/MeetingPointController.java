package com.gotacar.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.MeetingPoint;
import com.gotacar.backend.models.MeetingPointRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class MeetingPointController {
    
    @Autowired
    private MeetingPointRepository pointsRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/create_meeting_point")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    void createMeetingPoint(@RequestBody String body){
        try {
            JsonNode jsonNode = objectMapper.readTree(body);

            String address = objectMapper.readTree(jsonNode.get("address").toString()).asText();
            String name = objectMapper.readTree(jsonNode.get("name").toString()).asText();
            Double lat = objectMapper.readTree(jsonNode.get("lat").toString()).asDouble();
            Double lng = objectMapper.readTree(jsonNode.get("lng").toString()).asDouble();

            MeetingPoint mp = new MeetingPoint(lat, lng, address, name);

            pointsRepository.save(mp);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

	@GetMapping("/search_meeting_points")
	public List<MeetingPoint> findAllMeetingPoints(){
		List<MeetingPoint> response = new ArrayList<>();
		try {
			response = pointsRepository.findAll();
			System.out.println(response.toString());
            
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
		return response;
	}

}
