package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
import org.springframework.data.geo.Point;

import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepositoryCustom;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.controllers.TripControllerTest.TestConfig;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class TripControllerCustomTest {

	@Configuration
	static class TestConfig {
		@Bean
		@Primary
		public TripRepositoryCustom mockB() {
			TripRepositoryCustom mockService = Mockito.mock(TripRepositoryCustom.class);
			return mockService;
		}
	}
	
    @Autowired
	private MockMvc mockMvc;

    @MockBean
	private TripRepositoryCustom tripRepositoryCustom;

    @MockBean
	private UserRepository userRepository;

    private User user;
	private User driver;
	private Trip trip;
	private TripOrder order;
	private ZonedDateTime actualDate = ZonedDateTime.now();

	@BeforeEach
	void setUp() {
		actualDate = actualDate.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("ROLE_CLIENT");
		lista3.add("ROLE_DRIVER");

		driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es", "89070310K",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757575");
		ObjectId driverObjectId = new ObjectId();
		driver.setId(driverObjectId.toString());

		user = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2, "655757575");
		ObjectId userObjectId = new ObjectId();
		user.setId(userObjectId.toString());

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
	void testSearchTrips() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("date", "2021-05-24T16:00:00.000+00");
		sampleObject.appendField("places", trip.getPlaces());

		JSONObject startingPointObj = new JSONObject();
		startingPointObj.appendField("name", trip.getStartingPoint().getName());
		startingPointObj.appendField("address", trip.getStartingPoint().getAddress());
		startingPointObj.appendField("lat", trip.getStartingPoint().getLat());
		startingPointObj.appendField("lng", trip.getStartingPoint().getLng());

		sampleObject.appendField("starting_point", startingPointObj);

		JSONObject endingPointObj = new JSONObject();
		endingPointObj.appendField("name", trip.getStartingPoint().getName());
		endingPointObj.appendField("address", trip.getStartingPoint().getAddress());
		endingPointObj.appendField("lat", trip.getEndingPoint().getLat());
		endingPointObj.appendField("lng", trip.getEndingPoint().getLng());

		sampleObject.appendField("ending_point", endingPointObj);

		Point startingPoint = new Point(trip.getStartingPoint().getLat(),trip.getStartingPoint().getLng());
		Point endingPoint = new Point(trip.getEndingPoint().getLat(),trip.getEndingPoint().getLng());

		Mockito.when(tripRepositoryCustom.searchTrips(startingPoint,endingPoint,trip.getPlaces(),trip.getStartDate())).thenReturn(Arrays.asList(trip));

		ResultActions result = mockMvc.perform(post("/search_trips").contentType(MediaType.APPLICATION_JSON)
			.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

		String res = result.andReturn().getResponse().getContentAsString();
		System.out.println(res);
		int contador = 0;
		while (res.indexOf("startingPoint") > -1) {
			res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(),
			res.length());
			contador++;
		}

		assertThat(contador).isEqualTo(6);
	}

}

