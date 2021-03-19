package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.Trip;
import com.gotacar.backend.models.TripRepository;
import com.gotacar.backend.utils.SearchTrip;

import org.bson.codecs.DateCodec;
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

    private SearchTrip parseJSONParams(JsonNode jsonNode) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode startingPointJson = objectMapper.readTree(jsonNode.get("starting_point").toString());
            JsonNode endingPointJson = objectMapper.readTree(jsonNode.get("ending_point").toString());
            JsonNode dateJson = objectMapper.readTree(jsonNode.get("date").toString());
            JsonNode placesJson = objectMapper.readTree(jsonNode.get("places").toString());

            Location sp = new Location("", "", startingPointJson.get("lng").asDouble(),
                    startingPointJson.get("lat").asDouble());
            Location ep = new Location("", "", endingPointJson.get("lng").asDouble(),
                    endingPointJson.get("lat").asDouble());

            Integer year = Integer.parseInt(dateJson.asText().substring(0,4));
            Integer month = Integer.parseInt(dateJson.asText().substring(5,7));
            Integer day = Integer.parseInt(dateJson.asText().substring(8,10));
            Integer hour = Integer.parseInt(dateJson.asText().substring(11,13));
            Integer mnt = Integer.parseInt(dateJson.asText().substring(14,16));
            Integer secs = Integer.parseInt(dateJson.asText().substring(17,19));

            LocalDateTime d = LocalDateTime.of(year, month, day, hour, mnt, secs);
            Integer p = placesJson.asInt();
            SearchTrip s = new SearchTrip(sp, ep, d, p);

            return s;

        } catch (Exception e) {
            e.getMessage();
            return null;
        }
    }

    private List<Trip> getClosedTrips(SearchTrip search) {
        List<Trip> all = tripRepository.findAll();

        Circle startingPointArea = new Circle(search.getStartingPoint().getLat(), search.getStartingPoint().getLng(),
                0.99);
        List<Trip> tripsInStartingPointArea = tripRepository.findByStartingPointWithin(startingPointArea);

        Circle endingPointArea = new Circle(search.getEndingPoint().getLat(), search.getEndingPoint().getLng(), 0.99);
        List<Trip> tripsInEndingPointArea = tripRepository.findByStartingPointWithin(endingPointArea);
        
        List<Trip> res = all.stream().filter(x -> tripsInStartingPointArea.contains(x) && tripsInEndingPointArea.contains(x)
        && x.getPlaces() >= search.getPlaces()).collect(Collectors.toList());
        return res;
    }

    @PostMapping("/search_trips")
    public List<Trip> searchTrip(@RequestBody() String body) {
        List<Trip> response = new ArrayList<Trip>();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);
            SearchTrip search = parseJSONParams(jsonNode);
            response = getClosedTrips(search);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return response;
    }
}
