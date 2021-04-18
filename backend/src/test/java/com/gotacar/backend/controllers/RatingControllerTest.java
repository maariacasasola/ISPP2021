package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.rating.Rating;
import com.gotacar.backend.models.rating.RatingRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepository;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;
import com.gotacar.backend.controllers.TripControllerTest.TestConfig;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class RatingControllerTest {

	@Configuration
	static class TestConfig {
		@Bean
		@Primary
		public RatingRepository mockB() {
			RatingRepository mockService = Mockito.mock(RatingRepository.class);
			return mockService;
		}
	}

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private TripRepository tripRepository;

	@MockBean
	private RatingRepository ratingRepository;

	@MockBean
    private TripOrderRepository tripOrderRepository;

	@MockBean
	private UserRepository userRepository;

	private User user;
	private User driver;
	private User driver2;
	private User driver3;
	private Trip trip;
	private Trip trip2;
	private Rating rating1;
	private Rating rating2;
	private Rating rating3;
	private TripOrder order;
	private TripOrder order2;
	private TripOrder order3;

	@BeforeEach
	void setUp() {
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("ROLE_CLIENT");
		lista3.add("ROLE_DRIVER");

		driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es", "89070310K",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757575");
		ObjectId driverObjectId = new ObjectId();
		driver.setId(driverObjectId.toString());

		driver2 = new User("Manuel", "Fernández", "h9HmVQqlBQXD289O8t8q7aN2Gzg2", "driver2@gmail.com", "312312312R",
		"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757575");
		ObjectId driverObjectId2 = new ObjectId();
		driver2.setId(driverObjectId2.toString());

		driver3 = new User("Manuel", "Fernández", "h9HmVQqlBQXD289O8t8q7aN2Gzg3", "driver3@gmail.com", "312312313R",
		"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757535");
		ObjectId driverObjectId3 = new ObjectId();
		driver3.setId(driverObjectId3.toString());

		user = new User("Martín", "Romero", "trKzninltQNh75RemITKB8tBIjY2", "client@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2, "655757575");
		ObjectId userObjectId = new ObjectId();
		user.setId(userObjectId.toString());

		Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
		Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958, -5.976345387146261);
		trip = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver);
		ObjectId tripObjectId = new ObjectId();
		trip.setId(tripObjectId.toString());

		trip2 = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver);
		ObjectId tripObjectId2 = new ObjectId();
		trip2.setId(tripObjectId2.toString());
		

		rating1 = new Rating(driver,user,"El cliente es pésimo", 1, trip);
		rating2 = new Rating(driver, driver2, "El cliente es muy bueno", 4, trip);
		rating3 = new Rating(driver2, user, "El cliente es muy bueno", 3, trip2);
		ObjectId ratingObjectId = new ObjectId();
		ObjectId ratingObjectId2 = new ObjectId();
		ObjectId ratingObjectId3 = new ObjectId();
		rating1.setId(ratingObjectId.toString());
		rating2.setId(ratingObjectId2.toString());
		rating3.setId(ratingObjectId3.toString());

		order = new TripOrder(trip, user, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
        ObjectId orderObjectId = new ObjectId();
        order.setId(orderObjectId.toString());
		order2 = new TripOrder(trip, driver2, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
        ObjectId orderObjectId2 = new ObjectId();
        order2.setId(orderObjectId2.toString());
		order3 = new TripOrder(trip, user, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
        ObjectId orderObjectId3 = new ObjectId();
        order3.setId(orderObjectId3.toString());
	}

	@Test
	void testRateUser() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
		Mockito.when(ratingRepository.findByTo(user)).thenReturn(java.util.Arrays.asList(rating3));
		Mockito.when(ratingRepository.findAll()).thenReturn(java.util.Arrays.asList(rating3));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("to", user.getId());
		rating.appendField("content", "mal pasajero");
		rating.appendField("trip_id",trip.getId());
		rating.appendField("points", 1);
		

		ResultActions result = mockMvc
				.perform(post("/rate").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(user.getAverageRatings()).isEqualTo(3);
	}

	@Test
	void testAverageRateUser() throws Exception {
		Mockito.when(userRepository.findByUid(driver3.getUid())).thenReturn(driver3);
		Mockito.when(userRepository.findByEmail(driver3.getEmail())).thenReturn(driver3);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
		Mockito.when(ratingRepository.findByTo(user)).thenReturn(java.util.Arrays.asList(rating1,rating3));
		Mockito.when(ratingRepository.findAll()).thenReturn(java.util.Arrays.asList(rating1,rating3));

		String response = mockMvc.perform(post("/user").param("uid", driver3.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("to", user.getId());
		rating.appendField("content", "mal pasajero");
		rating.appendField("trip_id",trip.getId());
		rating.appendField("points", 1);
		

		ResultActions result = mockMvc
				.perform(post("/rate").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(user.getAverageRatings()).isEqualTo(2);
	}

	@Test
	void testUserCantRateSameUser() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
		Mockito.when(ratingRepository.findByTo(user)).thenReturn(java.util.Arrays.asList(rating1,rating3));
		Mockito.when(ratingRepository.findAll()).thenReturn(java.util.Arrays.asList(rating1,rating3));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("to", user.getId());
		rating.appendField("content", "mal pasajero");
		rating.appendField("trip_id",trip.getId());
		rating.appendField("points", 1);
		

		ResultActions result = mockMvc
				.perform(post("/rate").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(400);
		assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El usuario al que intenta valorar ya lo ha valorado previamente");
	}

	@Test
	void testContentCantBeBlank() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
		Mockito.when(ratingRepository.findByTo(user)).thenReturn(java.util.Arrays.asList(rating1,rating3));
		Mockito.when(ratingRepository.findAll()).thenReturn(java.util.Arrays.asList(rating1,rating3));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("to", user.getId());
		rating.appendField("content", "");
		rating.appendField("trip_id",trip.getId());
		rating.appendField("points", 1);
		

		ResultActions result = mockMvc
				.perform(post("/rate").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(400);
		assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El contenido está vacío");
	}

	@Test
	void testUserDoesNotExist() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
		Mockito.when(ratingRepository.findByTo(user)).thenReturn(java.util.Arrays.asList(rating1,rating3));
		Mockito.when(ratingRepository.findAll()).thenReturn(java.util.Arrays.asList(rating1,rating3));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("to", driver2.getId());
		rating.appendField("content", "Buena valoracion");
		rating.appendField("trip_id",trip.getId());
		rating.appendField("points", 1);
		

		ResultActions result = mockMvc
				.perform(post("/rate").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(400);
		assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El usuario al que intenta valorar no existe en nuestra base de datos");
	}

	@Test
	void testBadPointsRange() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
		Mockito.when(ratingRepository.findByTo(user)).thenReturn(java.util.Arrays.asList(rating1,rating3));
		Mockito.when(ratingRepository.findAll()).thenReturn(java.util.Arrays.asList(rating1,rating3));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("to", user.getId());
		rating.appendField("content", "Buena valoracion");
		rating.appendField("trip_id",trip.getId());
		rating.appendField("points", 0);
		

		ResultActions result = mockMvc
				.perform(post("/rate").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(400);
		assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("Las valoraciones no están en el rango 1-5");
	}

	@Test
	void testCheckUsersRated() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(ratingRepository.findByFrom(driver)).thenReturn(java.util.Arrays.asList(rating1,rating2));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		JSONObject rating = new JSONObject();
		rating.appendField("id_users", user.getId()+","+driver.getId()+",");
		rating.appendField("trip_id", trip.getId());
		
		ResultActions result = mockMvc
				.perform(post("/rate/check").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
				.content(rating.toJSONString()).accept(MediaType.APPLICATION_JSON));
		
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(result.andReturn().getResponse().getContentAsString().substring(2, result.andReturn().getResponse().getContentAsString().length()-2)).isEqualTo(user.getId());
	}
}
