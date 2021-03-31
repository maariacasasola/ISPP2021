package com.gotacar.backend.controllers;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

	@RequestMapping("/")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("La API funciona correctamente");
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
}
