package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthoritationControllerTest {

	@Autowired
	private UserController controller;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testUserController() throws Exception {
		mockMvc.perform(post("/user").param("uid", "1")).andExpect(status().isOk());
		assertThat(controller).isNotNull();
	}

	// @Test
	// void testSearchTrip() {
	// 	// mockMvc.perform(post("/search_trips").param("startingPoint", "Triana").param("endingPoint", "Torneo")
	// 	// 		.param("date", "2021-06-04").param("places", "4")).andExpect(status().isOk());
	// }
}
