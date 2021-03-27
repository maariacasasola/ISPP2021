package com.gotacar.backend.controllers;


import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
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
    /*
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping("/cancel_trip_driver")
    public Trip CancelTripDriver(@RequestBody() String body) {
    	Trip trip1 = new Trip();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);          
          
            trip1 = tripRepository.findById(jsonNode.get("id").asText()).orElseGet(()-> null);
            
            Boolean canceled = trip1.getCanceled();
            
            User driver = trip1.getDriver();
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());
            
            if(!((currentUser.getId()).equals(driver.getId()))) {
            	System.out.println("No puede cancelar un viaje un conductor diferente al creador");
            	return trip1;
            }
            
            if(canceled == true) {
            	System.out.println("El viaje ya está cancelado");
            	return trip1;
            }else {
				trip1.setCanceled(true);
			}

            tripRepository.save(trip1);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        
        return trip1;

    }*/
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping("/cancel_trip_driver")
    public ResponseEntity<Trip> CancelTripDriver(@RequestBody() String body) {
    	Trip trip1 = new Trip();
    	HttpHeaders responseHeaders = new HttpHeaders();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);          
          
            trip1 = tripRepository.findById(jsonNode.get("id").asText()).orElseGet(()-> null);
            
            Boolean canceled = trip1.getCanceled();
            
            
            //Compruebo si el conductor del viaje es el usuario logueado (STATUS: 403)
            User driver = trip1.getDriver();
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());
            
            
            if(!((currentUser.getId()).equals(driver.getId()))) {
            	System.out.println("No puede cancelar un viaje un conductor diferente al creador");
            	
                responseHeaders.set("message", 
                  "No puede cancelar un viaje un conductor diferente al creador");
                
            	return ResponseEntity
            			.status(HttpStatus.FORBIDDEN)
            			.headers(responseHeaders)
            			.body(trip1);
            }
            
            //Si ya esta cencelado, envía un mensaje y no modifica el viaje (STATUS: 208)
            if(canceled == true) {
            	System.out.println("El viaje ya está cancelado");
            	responseHeaders.set("message", 
                        "El viaje ya está cancelado");
            	return ResponseEntity
            			.status(HttpStatus.ALREADY_REPORTED)
            			.headers(responseHeaders)
            			.body(trip1);
            }
            
            
            //Si todo esta correcto se cancela y se establece la fecha (STATUS: 201)
			trip1.setCanceled(true);
			trip1.setCancelationDate(LocalDateTime.now());
			

            tripRepository.save(trip1);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        responseHeaders.set("message", 
                "Se ha cancelado el viaje con exito");
        return ResponseEntity
    			.status(HttpStatus.CREATED)
    			.headers(responseHeaders)
    			.body(trip1);

    }
    
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    @PostMapping("/cancel_trip_driver_expired")
    public ResponseEntity<Trip> CancelTripDriverExpired(@RequestBody() String body) {
    	Trip trip1 = new Trip();
    	HttpHeaders responseHeaders = new HttpHeaders();
        try {
            JsonNode jsonNode = objectMapper.readTree(body);          
          
            trip1 = tripRepository.findById(jsonNode.get("id").asText()).orElseGet(()-> null);
            
            Boolean canceled = trip1.getCanceled();
            
            User driver = trip1.getDriver();
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());
            
            if(!((currentUser.getId()).equals(driver.getId()))) {
            	System.out.println("No puede cancelar un viaje un conductor diferente al creador");
            	
                responseHeaders.set("message", 
                  "No puede cancelar un viaje un conductor diferente al creador");
                
            	return ResponseEntity
            			.status(HttpStatus.FORBIDDEN)
            			.headers(responseHeaders)
            			.body(trip1);
            }
            
            if(canceled == true) {
            	System.out.println("El viaje ya está cancelado");
            	responseHeaders.set("message", 
                        "El viaje ya está cancelado");
            	return ResponseEntity
            			.status(HttpStatus.ALREADY_REPORTED)
            			.headers(responseHeaders)
            			.body(trip1);
            }
			trip1.setCanceled(true);
			trip1.setCancelationDate(LocalDateTime.now());
			
			driver.setBannedUntil(LocalDateTime.now().plusDays(14));
			
			userRepository.save(driver);
            tripRepository.save(trip1);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        responseHeaders.set("message", 
                "Se ha cancelado el viaje con exito");
        return ResponseEntity
    			.status(HttpStatus.CREATED)
    			.headers(responseHeaders)
    			.body(trip1);

    }

}
