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
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

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
import org.springframework.security.test.context.support.WithMockUser;

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
	private MockMvc mockMvc;

	@Autowired
	private UserController controller;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private TripRepository tripRepository;

	@MockBean
	private TripOrderRepository tripOrderRepository;
	
	private User user1;
	private User user2;
	private User admin;
	private User driver1;
	private User driver2;
	private Trip trip1;
	private Trip trip2;
	private TripOrder tripOrder1;
	private TripOrder tripOrder2;

	@BeforeEach
	void setUp() {
		List<String> lista1 = new ArrayList<String>();
		lista1.add("ROLE_ADMIN");
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("ROLE_CLIENT");
		lista3.add("ROLE_DRIVER");

		driver1 = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver1@gotacar.es", "89070310K",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3);
		ObjectId driverObjectId1 = new ObjectId();
		driver1.setId(driverObjectId1.toString());

		driver2 = new User("Manuel", "Fernández", "h9HmVQqlBQXD289O8t8q7aN2Gzg2", "driver2@gmail.com", "312312312R",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3);
		ObjectId driverObjectId2 = new ObjectId();
		driver2.setId(driverObjectId2.toString());

		user1 = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client1@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2);
		ObjectId userObjectId1 = new ObjectId();
		user1.setId(userObjectId1.toString());

		user2 = new User("Pedro", "Serrano", "oQfGQi4xechNkcQEdHg29sM5rP33", "client2@gotacar.es", "42941220L",
		"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2);
		ObjectId userObjectId2 = new ObjectId();
		user2.setId(userObjectId2.toString());
		
		admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es", "89070360G",
				"http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1);
		ObjectId adminObjectId = new ObjectId();
		admin.setId(adminObjectId.toString());

		Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
		Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958, -5.976345387146261);
		trip1 = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver1);
		ObjectId tripObjectId1 = new ObjectId();
		trip1.setId(tripObjectId1.toString());

		trip2 = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver2);
		ObjectId tripObjectId2 = new ObjectId();
		trip2.setId(tripObjectId2.toString());

		tripOrder1 = new TripOrder(trip1, user1, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
		ObjectId orderObjectId1 = new ObjectId();
		tripOrder1.setId(orderObjectId1.toString());

		tripOrder2 = new TripOrder(trip2, driver1, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
		ObjectId orderObjectId2 = new ObjectId();
		tripOrder2.setId(orderObjectId2.toString());
	}

	@Test
	public void testUserController() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		
		mockMvc.perform(post("/user").param("uid", admin.getUid())).andExpect(status().isOk());
		assertThat(controller).isNotNull();
	}

	@Test
	public void testListEnrolledUsers() throws Exception{
		List<User> lista = new ArrayList<User>();
		lista.add(admin);
		lista.add(driver1);
		lista.add(driver2);
		lista.add(user1);
		lista.add(user2);
		Mockito.when(userRepository.findAll()).thenReturn(lista);
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		
		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");
		
		ResultActions result = mockMvc
				.perform(get("/list_enrolled_users").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		String res = result.andReturn().getResponse().getContentAsString();
		assertThat(res.contains("ROLE_ADMIN")).isEqualTo(false);
		
	}

	@Test
	public void deleteAccountWithTripAndTripOrder() throws Exception{
        Mockito.when(userRepository.findByUid(driver1.getUid())).thenReturn(driver1);
		Mockito.when(userRepository.findByEmail(driver1.getEmail())).thenReturn(driver1);
		Mockito.when(tripRepository.findByDriverAndCanceled(driver1, false)).thenReturn(java.util.Arrays.asList(trip1));
		Mockito.when(tripOrderRepository.findByUserAndStatus(driver1, "PROCCESSING")).thenReturn(java.util.Arrays.asList(tripOrder2));

		String response = mockMvc.perform(post("/user").param("uid", driver1.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");
		
		ResultActions result = mockMvc
				.perform(get("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	public void deleteAccountWithTrip() throws Exception{
		Mockito.when(userRepository.findByUid(driver2.getUid())).thenReturn(driver2);
		Mockito.when(userRepository.findByEmail(driver2.getEmail())).thenReturn(driver2);
		Mockito.when(tripRepository.findByDriverAndCanceled(driver2, false)).thenReturn(java.util.Arrays.asList(trip2));
		Mockito.when(tripOrderRepository.findByUserAndStatus(driver2, "PROCCESSING")).thenReturn(new ArrayList<TripOrder>());

		String response = mockMvc.perform(post("/user").param("uid", driver2.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");
		
		ResultActions result = mockMvc
				.perform(get("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	public void deleteAccountWithTripOrder() throws Exception{
		Mockito.when(userRepository.findByUid(user1.getUid())).thenReturn(user1);
		Mockito.when(userRepository.findByEmail(user1.getEmail())).thenReturn(user1);
		Mockito.when(tripRepository.findByDriverAndCanceled(user1, false)).thenReturn(new ArrayList<Trip>());
		Mockito.when(tripOrderRepository.findByUserAndStatus(user1, "PROCCESSING")).thenReturn(java.util.Arrays.asList(tripOrder1));
		
		String response = mockMvc.perform(post("/user").param("uid", user1.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");
		
		ResultActions result = mockMvc
				.perform(get("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	public void deleteAccountNothing() throws Exception{
		Mockito.when(userRepository.findByUid(user2.getUid())).thenReturn(user2);
		Mockito.when(userRepository.findByEmail(user2.getEmail())).thenReturn(user2);
		Mockito.when(tripRepository.findByDriverAndCanceled(user2, false)).thenReturn(new ArrayList<Trip>());
		Mockito.when(tripOrderRepository.findByUserAndStatus(user2, "PROCCESSING")).thenReturn(new ArrayList<TripOrder>());
		
		String response = mockMvc.perform(post("/user").param("uid", user2.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");
		
		ResultActions result = mockMvc
				.perform(get("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}
	
	@Test
	@WithMockUser(value = "spring")
	public void testCurrentUser() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByEmail(admin.getEmail())).thenReturn(admin);
		
		String response = mockMvc.perform(post("/user").param("uid", admin.getUid()))
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
