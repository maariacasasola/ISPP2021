package com.gotacar.backend.controllers;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepository;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class TripController {

	@Autowired
	private TripRepository tripRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TripOrderRepository tripOrderRepository;

	private static ObjectMapper objectMapper = new ObjectMapper();

	@PostMapping(path = "/search_trips", consumes = "application/json")
	public List<Trip> searchTrip(@RequestBody() String body) {
		try {
			JsonNode jsonNode = objectMapper.readTree(body);
			JsonNode startingPointJson = objectMapper.readTree(jsonNode.get("starting_point").toString());
			JsonNode endingPointJson = objectMapper.readTree(jsonNode.get("ending_point").toString());
			Integer placesJson = objectMapper.readTree(jsonNode.get("places").toString()).asInt();
			LocalDateTime dateJson = OffsetDateTime
					.parse(objectMapper.readTree(jsonNode.get("date").toString()).asText()).toLocalDateTime();
			Point startingPoint = new Point(startingPointJson.get("lng").asDouble(),
					startingPointJson.get("lat").asDouble());
			Point endingPoint = new Point(endingPointJson.get("lng").asDouble(), endingPointJson.get("lat").asDouble());
			return tripRepository.searchTrips(startingPoint, endingPoint, placesJson, dateJson);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
		}

	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/list_trips")
	public List<Trip> listTrips() {
		try {
			return tripRepository.findAll();
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}

	@PreAuthorize("hasRole('ROLE_DRIVER')")
	@PostMapping("/create_trip")
	public Trip createTrip(@RequestBody() String body) {
		try {
			Trip trip1 = new Trip();
			JsonNode jsonNode = objectMapper.readTree(body);

			JsonNode startingPointJson = objectMapper.readTree(jsonNode.get("starting_point").toString());

			Location startingPoint = new Location(startingPointJson.get("name").asText(),
					startingPointJson.get("address").asText(), startingPointJson.get("lat").asDouble(),
					startingPointJson.get("lng").asDouble());

			JsonNode endingPointJson = objectMapper.readTree(jsonNode.get("ending_point").toString());

			Location endingPoint = new Location(endingPointJson.get("name").asText(),
					endingPointJson.get("address").asText(), endingPointJson.get("lat").asDouble(),
					endingPointJson.get("lng").asDouble());

			Integer placesJson = objectMapper.readTree(jsonNode.get("places").toString()).asInt();

			Integer price = objectMapper.readTree(jsonNode.get("price").toString()).asInt();

			ZonedDateTime dateStartZone = ZonedDateTime
					.parse(objectMapper.readTree(jsonNode.get("start_date").toString()).asText());
			dateStartZone = dateStartZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));

			LocalDateTime dateStartJson = dateStartZone.toLocalDateTime();

			ZonedDateTime dateEndZone = ZonedDateTime
					.parse(objectMapper.readTree(jsonNode.get("end_date").toString()).asText());
			dateEndZone = dateEndZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));

			LocalDateTime dateEndJson = dateEndZone.toLocalDateTime();

			String comments = objectMapper.readTree(jsonNode.get("comments").toString()).asText();

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());

			LocalDateTime cancelationDateLimit = dateStartJson.minusHours(1);
			
			//Lanza error si la fecha de finalizacion es anterior a la de salida
			if(dateEndJson.isBefore(dateStartJson)) {
				throw new Exception("La hora de llegada no puede ser anterior a la hora de salida");
			}
			//Lanza error si la fecha de salida es igual a la fecha de finalización
			if(dateEndJson.isEqual(dateStartJson)) {
				throw new Exception("La hora de salida no puede ser igual a la hora de llegada");
			}

			//Lanza error si la fecha de salida es cercana a la fecha de finalización
			if(dateStartJson.plusMinutes(5).isAfter(dateEndJson)) {
				throw new Exception("La hora de salida no puede ser tan cercana a la hora de llegada");
			}
			
			//Lanza error si la fecha de salida no dista una hora de la fecha actual
			if(dateStartJson.isBefore(LocalDateTime.now().plusMinutes(50))) {
				throw new Exception("El viaje debe ser publicado, al menos, con una hora de antelación");
			}

			trip1.setCancelationDateLimit(cancelationDateLimit);
			trip1.setEndingDate(dateEndJson);
			trip1.setStartingPoint(startingPoint);
			trip1.setEndingPoint(endingPoint);
			trip1.setPrice(price);
			trip1.setComments(comments);
			trip1.setStartDate(dateStartJson);
			trip1.setPlaces(placesJson);
			trip1.setDriver(currentUser);

			tripRepository.save(trip1);
			return trip1;
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
		}
	}

	@PreAuthorize("hasRole('ROLE_DRIVER')")
	@PostMapping("/cancel_trip_driver/{trip_id}")
	public Trip cancelTripDriver(@PathVariable(value = "trip_id") String tripId) {
		try {
			Trip trip1 = tripRepository.findById(new ObjectId(tripId));

			Boolean canceled = trip1.getCanceled();

			// Compruebo si el conductor del viaje es el usuario logueado
			User driver = trip1.getDriver();

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());

			if (!((currentUser.getId()).equals(driver.getId()))) {
				throw new Exception("Usted no ha realizado este viaje");
			}

			// Si ya esta cencelado, envía un mensaje y no modifica el viaje
			if (canceled == true) {
				throw new Exception("El viaje ya está cancelado");
			}

			trip1.setCanceled(true);
			trip1.setCancelationDate(LocalDateTime.now());

			if (trip1.getCancelationDateLimit().isBefore(LocalDateTime.now())) {
				driver.setBannedUntil(LocalDateTime.now().plusDays(14));
				userRepository.save(driver);
			}

			List<TripOrder> orders = tripOrderRepository.findByTrip(trip1);

			for (TripOrder order : orders) {
				order.setStatus("REFUNDED_PENDING");
				tripOrderRepository.save(order);
			}

			tripRepository.save(trip1);
			return trip1;
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}

	}

	@PreAuthorize("hasRole('ROLE_DRIVER')")
	@GetMapping("/list_trips_driver")
	public List<Trip> listTripsDriver() {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			User currentUser = userRepository.findByEmail(authentication.getPrincipal().toString());
			return tripRepository.findByDriver(currentUser);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}

	@GetMapping("/trip/{tripId}")
	public @ResponseBody Trip getTripDetails(@PathVariable(value = "tripId") String tripId) {
		try {
			return tripRepository.findById(new ObjectId(tripId));
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}
}
