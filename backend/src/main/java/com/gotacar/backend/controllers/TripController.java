package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class TripController {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

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

    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping("/create_trip")
    public Trip createTrip(@RequestBody() String body) {
        Trip trip1 = new Trip();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);

            JsonNode startingPointJson = objectMapper.readTree(jsonNode.get("starting_point").toString());

            Location startingPoint = new Location(startingPointJson.get("name").toString(),
                    startingPointJson.get("address").toString(), startingPointJson.get("lng").asDouble(),
                    startingPointJson.get("lat").asDouble());

            JsonNode endingPointJson = objectMapper.readTree(jsonNode.get("ending_point").toString());

            Location endingPoint = new Location(endingPointJson.get("name").toString(),
                    endingPointJson.get("address").toString(), endingPointJson.get("lng").asDouble(),
                    endingPointJson.get("lat").asDouble());

            Integer placesJson = objectMapper.readTree(jsonNode.get("places").toString()).asInt();

            Integer price = objectMapper.readTree(jsonNode.get("price").toString()).asInt();

            LocalDateTime dateStartJson = OffsetDateTime
                    .parse(objectMapper.readTree(jsonNode.get("start_date").toString()).asText()).toLocalDateTime();

            LocalDateTime dateEndJson = OffsetDateTime
                    .parse(objectMapper.readTree(jsonNode.get("end_date").toString()).asText()).toLocalDateTime();

            String comments = objectMapper.readTree(jsonNode.get("comments").toString()).asText();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());

            trip1.setCancelationDate(dateEndJson);
            trip1.setStartingPoint(startingPoint);
            trip1.setEndingPoint(endingPoint);
            trip1.setPrice(price);
            trip1.setComments(comments);
            trip1.setStartDate(dateStartJson);
            trip1.setPlaces(placesJson);
            trip1.setDriver(currentUser);

            System.out.println(trip1.getId() + "trip llega a crearse");


            tripRepository.save(trip1);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return trip1;

    }

    @GetMapping("/trip/{tripId}")
    public @ResponseBody Trip getTripDetails(@PathVariable(value = "tripId") String tripId) {
            return tripRepository.findById(new ObjectId(tripId));
    }
}
