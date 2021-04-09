package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;

import org.bson.types.ObjectId;
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
import com.gotacar.backend.controllers.UserControllerTest.TestConfig;

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

	@MockBean
	private TripRepository tripRepository;

	@Autowired
	private MockMvc mockMvc;

	

	private User user;
	private User admin;
	private User driver;
	private Trip trip;
	private TripOrder order;

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

		user = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2);
		ObjectId userObjectId = new ObjectId();
		user.setId(userObjectId.toString());

		admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es", "89070360G",
				"http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1);
		ObjectId adminObjectId = new ObjectId();
		admin.setId(adminObjectId.toString());

		Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
		Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958, -5.976345387146261);
		trip = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver);
		ObjectId tripObjectId = new ObjectId();
		trip.setId(tripObjectId.toString());

		order = new TripOrder(trip, user, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
		ObjectId orderObjectId = new ObjectId();
		order.setId(orderObjectId.toString());
	}

	@Test
	public void testUserController() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		mockMvc.perform(post("/user").param("uid", admin.getUid())).andExpect(status().isOk());
		assertThat(controller).isNotNull();
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
	
	@Test
	@WithMockUser(value = "spring")
	public void testFindUsersByTrip() throws Exception{
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid()))
        .andReturn().getResponse().getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
        String token = json2.getString("token");
		String tripId = trip.getId();

		ResultActions result = mockMvc.perform(get("/list_users_trip/{tripId}", tripId).header("Authorization", token)
        .contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(result.andReturn().getResponse().getErrorMessage()).isNull();

	}
}
