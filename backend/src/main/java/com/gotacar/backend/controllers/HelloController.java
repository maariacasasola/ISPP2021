package com.gotacar.backend.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

import com.gotacar.backend.models.Trip;
import com.gotacar.backend.models.TripRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

	@Autowired
	private TripRepository tripRepository;

	@RequestMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Holaaaa");
	}

	@PreAuthorize("hasRole('ROLE_CLIENT') OR hasRole('ROLE_DRIVER')")
	@RequestMapping("/user")
	public String user(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Soy un usuario normal");
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@RequestMapping("/admin")
	public String admin(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Soy un administrador");
	}

	@RequestMapping("/viajes")
	public List<Trip> get_all_trips() {
		return tripRepository.findAll();
	}
}
