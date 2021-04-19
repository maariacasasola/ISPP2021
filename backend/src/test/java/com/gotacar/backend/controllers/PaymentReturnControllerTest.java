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

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;

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

	@BeforeEach
	void setUp() {
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

		paymentReturn1 = new PaymentReturn(user, 150);
		ObjectId payment1ObjectId = new ObjectId();
		paymentReturn1.setId(payment1ObjectId.toString());
		paymentReturn2 = new PaymentReturn(user, 180);
		ObjectId payment2ObjectId = new ObjectId();
		paymentReturn2.setId(payment2ObjectId.toString());

	}

	@Test
	void testListAllPendingReturns() throws Exception {
		Mockito.when(paymentReturnRepository.findAll())
				.thenReturn(java.util.Arrays.asList(paymentReturn1, paymentReturn2));
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		// Obtenemos el token
		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		// Hacemos la peticion
		ResultActions result = mockMvc.perform(
				get("/payment-return/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		String res = result.andReturn().getResponse().getContentAsString();
		int contador = 0;
		while (res.contains("amount")) {
			res = res.substring(res.indexOf("amount") + "amount".length(), res.length());
			contador++;
		}

		// Comprobamos el resultado
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(contador).isEqualTo(2);
	}

	@Test
	void testListAllPendingReturnsAsClient() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		// Obtenemos el token
		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		// Hacemos la peticion
		ResultActions result = mockMvc.perform(
				get("/payment-return/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		// Comprobamos el resultado
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

}