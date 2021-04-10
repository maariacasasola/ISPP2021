package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.controllers.TripControllerTest.TestConfig;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class UserControllerTest {

	@Configuration
	static class TestConfig {
		@Bean
		@Primary
		public UserRepository mockB() {
			UserRepository mockService = Mockito.mock(UserRepository.class);
			return mockService;
		}
	}

	@Autowired
	private UserController controller;

	@MockBean
	private UserRepository userRepository;

	@Autowired
	private MockMvc mockMvc;

	private User user;
	private User user1;
	private User admin;
	private User driver;
	private User driver2;

	@BeforeEach
	void setUp() {
		List<String> lista1 = new ArrayList<String>();
		lista1.add("ROLE_ADMIN");
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("ROLE_CLIENT");
		lista3.add("ROLE_DRIVER");

		driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es", "89070310K",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3);
		ObjectId driverObjectId = new ObjectId();
		driver.setId(driverObjectId.toString());

		driver2 = new User("Manuel", "Fernández", "h9HmVQqlBQXD289O8t8q7aN2Gzg2", "driver2@gmail.com", "312312312R",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3);
		ObjectId driverObjectId2 = new ObjectId();
		driver2.setId(driverObjectId2.toString());

		user = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2);
		ObjectId userObjectId = new ObjectId();
		user.setId(userObjectId.toString());

		user1 = new User("Manolo", "Escibar", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE2", "client1@gotacar.es", "89070338D",
				"http://dniclient.com", LocalDate.of(1999, 11, 10), lista2);
		user1.setDriverStatus("PENDING");
		ObjectId user1ObjectId = new ObjectId();
		user1.setId(user1ObjectId.toString());

		admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es", "89070360G",
				"http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1);
		ObjectId adminObjectId = new ObjectId();
		admin.setId(adminObjectId.toString());

	}

	@Test
	public void testUserController() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		mockMvc.perform(post("/user").param("uid", admin.getUid())).andExpect(status().isOk());
		assertThat(controller).isNotNull();
	}

	@Test
	public void testListEnrolledUsers() throws Exception {
		List<User> lista = new ArrayList<User>();
		lista.add(admin);
		lista.add(driver);
		lista.add(driver2);
		lista.add(user);
		Mockito.when(userRepository.findAll()).thenReturn(lista);
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/enrolled-user/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		String res = result.andReturn().getResponse().getContentAsString();
		assertThat(res.contains("ROLE_ADMIN")).isEqualTo(false);

	}

	@Test
	public void testCurrentUser() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByEmail(admin.getEmail())).thenReturn(admin);

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");

		// Petición post al controlador
		ResultActions result = mockMvc.perform(get("/current_user").header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON));
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(result.andReturn().getResponse().getContentType().equals(User.class.toString()));
	}

	@Test
	public void testConvertToDriver() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollment_date", "2012-06-04T13:30:00.000+00");
		car_data.appendField("car_plate", "4041 ATO");
		car_data.appendField("model", "Opel");
		car_data.appendField("color", "azul marino");
		// Construcción del json para el body
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());
		sampleObject.appendField("phone", "678678678");
		sampleObject.appendField("iban", "ES2121001859436727673434");
		sampleObject.appendField("driving_license",
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Floentiendo.com%2Frenovar-carnet-de-conducir%2Fcomment-page-4%2F&psig=AOvVaw3QB9z2DMG22U7ygu_nOW0o&ust=1618134528516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKj5w4Cz8-8CFQAAAAAdAAAAABAD");
		sampleObject.appendField("experience", 9);
		sampleObject.appendField("car_data", car_data);

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(result.andReturn().getResponse().getContentType().equals(User.class.toString()));
		assertThat(user.getDriverStatus()).isEqualTo("PENDING");
	}

	@Test
	public void testConvertToDriverFailed() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollment_date", "2012-06-04T13:30:00.000+00");
		car_data.appendField("car_plate", "4041 ATO");
		car_data.appendField("model", "Opel");
		car_data.appendField("color", "azul marino");
		// Construcción del json para el body
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());
		sampleObject.appendField("phone", "678678678");
		sampleObject.appendField("iban", "ES2121001859436727673434");
		sampleObject.appendField("driving_license",
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Floentiendo.com%2Frenovar-carnet-de-conducir%2Fcomment-page-4%2F&psig=AOvVaw3QB9z2DMG22U7ygu_nOW0o&ust=1618134528516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKj5w4Cz8-8CFQAAAAAdAAAAABAD");
		sampleObject.appendField("experience", 9);
		sampleObject.appendField("car_data", car_data);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	public void testConvertToDriverBanned() throws Exception {
		user.setBannedUntil(LocalDateTime.of(2021, 10, 10, 13, 30, 00));
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollment_date", "2012-06-04T13:30:00.000+00");
		car_data.appendField("car_plate", "4041 ATO");
		car_data.appendField("model", "Opel");
		car_data.appendField("color", "azul marino");
		// Construcción del json para el body
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());
		sampleObject.appendField("phone", "678678678");
		sampleObject.appendField("iban", "ES2121001859436727673434");
		sampleObject.appendField("driving_license",
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Floentiendo.com%2Frenovar-carnet-de-conducir%2Fcomment-page-4%2F&psig=AOvVaw3QB9z2DMG22U7ygu_nOW0o&ust=1618134528516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKj5w4Cz8-8CFQAAAAAdAAAAABAD");
		sampleObject.appendField("experience", 9);
		sampleObject.appendField("car_data", car_data);

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(409);
		assertThat(result.andReturn().getResponse().getErrorMessage())
				.isEqualTo("Ahora mismo su cuenta se encuentra baneada");
	}

	@Test
	public void testAcceptRequestToDriver() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(user.getDriverStatus()).isEqualTo("ACCEPTED");
	}

	@Test
	public void testAcceptRequestToDriverFailed() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	public void testFindAllPending() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByDriverStatus("PENDING")).thenReturn(java.util.Arrays.asList(user));

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/driver-request/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

		String res = result.andReturn().getResponse().getContentAsString();
		int contador = 0;
		while (res.contains("driverStatus")) {
			res = res.substring(res.indexOf("driverStatus") + "driverStatus".length(), res.length());
			contador++;
		}

		assertThat(contador).isEqualTo(1);

	}

	@Test
	public void testFindAllPendingFail() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByDriverStatus("PENDING")).thenReturn(java.util.Arrays.asList(user));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/driver-request/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);

	}
}
