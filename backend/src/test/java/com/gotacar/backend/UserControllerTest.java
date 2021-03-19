package com.gotacar.backend;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



import com.gotacar.backend.controllers.UserController;

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
	void testUserController() throws Exception{
		mockMvc.perform(post("/user")
    	.param("uid", "1"))
    	.andExpect(status().isOk());
		assertThat(controller).isNotNull();
	}

}
