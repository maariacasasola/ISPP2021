package com.gotacar.backend.controllers;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.rating.Rating;
import com.gotacar.backend.models.rating.RatingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class RatingController {

	private static ObjectMapper objectMapper = new ObjectMapper();
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RatingRepository ratingRepository;
	

	@PreAuthorize("hasRole('ROLE_CLIENT')")
	@PostMapping(path = "/rate", consumes = "application/json")
	public Rating rateUser(@RequestBody() String body) {
		try {
			Rating rate = new Rating();
			JsonNode jsonNode = objectMapper.readTree(body);
			String idUser = objectMapper.readTree(jsonNode.get("to").toString()).asText();
			String content = objectMapper.readTree(jsonNode.get("content").toString()).asText();
			Integer points = objectMapper.readTree(jsonNode.get("points").toString()).asInt();

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			User from = userRepository.findByEmail(authentication.getPrincipal().toString());
			User to = userRepository.findById(new ObjectId(idUser));
			
			if (points <1 || points >5){
				throw new IllegalArgumentException("Las valoraciones no están en el rango 1-5");
			}
			if (content == ""){
				throw new IllegalArgumentException("El contenido está vacío");
			}
			if (userRepository.findById(new ObjectId(idUser))==null){
				throw new IllegalArgumentException("El usuario al que intenta valorar no existe en nuestra base de datos");
			}

			
			LocalDateTime date = ZonedDateTime.of(LocalDateTime.now(), ZoneId.of("Europe/Madrid")).toLocalDateTime();
			rate.setTo(to);
			rate.setFrom(from);
			rate.setContent(content);
			rate.setCreatedAt(date);
			rate.setPoints(points);
			ratingRepository.save(rate);
	
			List<Rating> lsRating = ratingRepository.findByTo(to);
			Integer total =0;
			for (Rating r:lsRating){
				total+=r.getPoints();
			}
			Integer avg = total/lsRating.size();
			System.out.println("avg"+avg);
			to.setAverageRatings(avg);
			userRepository.save(to);
			System.out.println(to.getAverageRatings());
			return rate;
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
		}
	}

}
