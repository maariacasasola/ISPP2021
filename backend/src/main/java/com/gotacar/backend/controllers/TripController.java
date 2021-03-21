package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(path = "/search_trips", consumes = "application/json")
    public List<Trip> searchTrip(@RequestBody() String body) {
        List<Trip> response = new ArrayList<>();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            JsonNode startingPointJson = objectMapper.readTree(jsonNode.get("starting_point").toString());
            JsonNode endingPointJson = objectMapper.readTree(jsonNode.get("ending_point").toString());
            Integer placesJson = objectMapper.readTree(jsonNode.get("places").toString()).asInt();
            LocalDateTime dateJson = OffsetDateTime
                    .parse(objectMapper.readTree(jsonNode.get("date").toString()).asText()).toLocalDateTime();
            Point startingPoint = new Point(startingPointJson.get("lat").asDouble(),
                    startingPointJson.get("lng").asDouble());
            Point endingPoint = new Point(endingPointJson.get("lat").asDouble(), endingPointJson.get("lng").asDouble());
            response = tripRepository.searchTrips(startingPoint, endingPoint, placesJson, dateJson);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return response;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @RequestMapping("/list_trips")
    public List<Trip> listTrips() {
        List<Trip> lista = new ArrayList<>();
        try {

            lista = tripRepository.findAll();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return lista;
    }
}
