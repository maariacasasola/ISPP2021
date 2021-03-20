package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.gotacar.backend.models.MeetingPoint;

import com.gotacar.backend.models.MeetingPointRepository;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeetingPointController {
	
	@Autowired
	private MeetingPointRepository meetingPointRepository;
	
	@GetMapping("/search_meeting_points")
	public List<MeetingPoint> findAllMeetingPoints(){
		List<MeetingPoint> response = new ArrayList<>();
		try {
			response = meetingPointRepository.findAll();
			System.out.println(response.toString());
            
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		
		return response;
	}

}
