package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.gotacar.backend.models.User;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

	@Autowired
	private UserController controller;

	@Autowired
	private MockMvc mockMvc;

	@Test
	public void testUserController() throws Exception {
		mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2")).andExpect(status().isOk());
		assertThat(controller).isNotNull();
	}

	@Test
	@WithMockUser(value = "spring")
	public void testCurrentUser() throws Exception {
		String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg2"))
        .andReturn().getResponse().getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
        String token = json2.getString("token");

                // Petición post al controlador
        ResultActions result = mockMvc.perform(get("/current_user").header("Authorization", token)
        .contentType(MediaType.APPLICATION_JSON)
        .accept(MediaType.APPLICATION_JSON));
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(result.andReturn().getResponse().getContentType().equals(User.class.toString()));
	}
}
