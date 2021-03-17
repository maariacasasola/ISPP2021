package com.gotacar.backend.controllers;

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
	private TripRepository TripRepository;

	@RequestMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Holaaaa", null);
	}

	@RequestMapping("/adios")
	public String adios(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Adios", null);
	}

	@RequestMapping("/viajes")
	public List<Trip> get_all_trips() {
		return TripRepository.findAll();
	}
}
