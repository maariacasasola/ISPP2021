package com.gotacar.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.Trip;
import com.gotacar.backend.models.TripRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Circle;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/search_trips")
    public List<Trip> searchTrip(@RequestBody() String body) {
        List<Trip> response = new ArrayList<Trip>();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            JsonNode startingPointJson = objectMapper.readTree(jsonNode.get("starting_point").toString());

            Location startingPoint = new Location("", "", startingPointJson.get("lng").asDouble(),
                    startingPointJson.get("lat").asDouble());

            Circle startingPointArea = new Circle(startingPoint.getLat(),startingPoint.getLng(), 0.012);

            response = tripRepository.findByStartingPointWithin(startingPointArea);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return response;
    }
}
