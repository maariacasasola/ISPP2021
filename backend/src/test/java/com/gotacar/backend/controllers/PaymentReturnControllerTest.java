package com.gotacar.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.http.MediaType;

import jdk.jfr.Timestamp;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;

import net.minidev.json.JSONObject;

import org.bson.types.ObjectId;
import org.mockito.Mockito;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;


import com.gotacar.backend.models.paymentReturn.PaymentReturnRepository;
import com.gotacar.backend.models.paymentReturn.PaymentReturn;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.controllers.PaymentReturnControllerTest.TestConfig;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class PaymentReturnControllerTest {

    @Configuration
	static class TestConfig {
		@Bean
		@Primary
		public PaymentReturnRepository mockB() {
			PaymentReturnRepository mockService = Mockito.mock(PaymentReturnRepository.class);
			return mockService;
		}
	}

    @Autowired
	private MockMvc mockMvc;

	@MockBean
	private PaymentReturnRepository paymentReturnRepository;

    @MockBean
	private UserRepository userRepository;

    private User user;
    private User admin;
    private PaymentReturn paymentReturn1;
    private PaymentReturn paymentReturn2;
    private PaymentReturn paymentReturn3;

    @BeforeEach
    void setUp(){
        List<String> lista1 = new ArrayList<String>();
		lista1.add("ROLE_ADMIN");
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");

        user = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2, "655757575");
		ObjectId userObjectId = new ObjectId();
		user.setId(userObjectId.toString());

		admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es", "89070360G",
				"http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1, "655757575");
		ObjectId adminObjectId = new ObjectId();
		admin.setId(adminObjectId.toString());

        PaymentReturn paymentReturn1 = new PaymentReturn(user, 150);
        PaymentReturn paymentReturn2 = new PaymentReturn(user, 180);
        paymentReturn2.setStatus("DONE");

    }

    @Test
    void testListAllPendingReturns() throws Exception {
        Mockito.when(paymentReturnRepository.findByStatus("PENDING")).thenReturn(java.util.Arrays.asList(paymentReturn1));
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		//Obtenemos el token
		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		//Hacemos la peticion
		ResultActions result = mockMvc
				.perform(get("/paymentReturn/listPending").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		//Comprobamos el resultado
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		String res = result.andReturn().getResponse().getContentAsString();
		assertThat(res).isEqualTo(java.util.Arrays.asList(paymentReturn1).toString());
		assertThat(res).doesNotContain("DONE");

    }

	@Test
    void testListAllPendingReturnsAsClient() throws Exception {
        Mockito.when(paymentReturnRepository.findByStatus("PENDING")).thenReturn(java.util.Arrays.asList(paymentReturn1));
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		//Obtenemos el token
		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		//Hacemos la peticion
		ResultActions result = mockMvc
				.perform(get("/paymentReturn/listPending").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		//Comprobamos el resultado
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);

    }

}