package com.gotacar.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

	@GetMapping("/")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return "La API funciona correctamente";
	}

	@GetMapping("/wake-up")
	public Boolean wakeUp() {
		return true;
	}
}
