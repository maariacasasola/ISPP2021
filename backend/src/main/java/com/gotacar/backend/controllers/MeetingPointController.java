package com.gotacar.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.MeetingPoint;
import com.gotacar.backend.models.MeetingPointRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
    public MeetingPoint createMeetingPoint(@RequestBody String body){
    	MeetingPoint mp = new MeetingPoint();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);

            String address = objectMapper.readTree(jsonNode.get("address").toString()).asText();
            String name = objectMapper.readTree(jsonNode.get("name").toString()).asText();
            Double lat = objectMapper.readTree(jsonNode.get("lat").toString()).asDouble();
            Double lng = objectMapper.readTree(jsonNode.get("lng").toString()).asDouble();

            mp.setAddress(address);
            mp.setLat(lat);
            mp.setLng(lng);
            mp.setName(name);

            pointsRepository.save(mp);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        return mp;
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

    //Delete
    @PostMapping("/delete_meeting_point")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String deleteMeetingPoint(@RequestBody String body){
        try{
            JsonNode jsonNode = objectMapper.readTree(body);
            String id = objectMapper.readTree(jsonNode.get("mpId").toString()).asText();
            MeetingPoint mp = pointsRepository.findById(id).get();
            Boolean deletable = true; //modificar en caso de que haya alguna condicion por la cual no se deba borrar un meeting point
            pointsRepository.delete(mp);
            return "meeting point: " + id + "deleted";
            
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
