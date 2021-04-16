package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ContextConfiguration;
import com.gotacar.backend.controllers.TripOrderControllerTest.TestConfig;
import com.gotacar.backend.BackendApplication;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class TripOrderControllerTest {

    @Configuration
    static class TestConfig {
        @Bean
        @Primary
        public TripOrderRepository mockB() {
            TripOrderRepository mockService = Mockito.mock(TripOrderRepository.class);
            return mockService;
        }

    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripOrderRepository tripOrderRepository;

    @MockBean
    private UserRepository userRepository;

    private User user;
    private User admin;
    private User driver;
    private Trip trip;
    private TripOrder order;
    ZonedDateTime actualDate = ZonedDateTime.now();


    @BeforeEach
    void setUp() {
    	actualDate = actualDate.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
        List<String> lista1 = new ArrayList<String>();
        lista1.add("ROLE_ADMIN");
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

        admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es", "89070360G",
                "http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1, "655757575");
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
    void testListTripOrders() throws Exception {
        order = new TripOrder(trip, user, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
        Mockito.when(tripOrderRepository.findByUserId(order.getUser().getId())).thenReturn(Arrays.asList(order));
        Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
        Mockito.when(userRepository.findByEmail("client@gotacar.es")).thenReturn(user);

        String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc.perform(get("/list_trip_orders").header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

        String res = result.andReturn().getResponse().getContentAsString();
        int contador = 0;
        while (res.contains("startingPoint")) {
            res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
            contador++;
        }

        assertThat(contador).isEqualTo(1);
    }

    @Test
    void testCancelTripOrderRequest() throws Exception {
        trip.setCancelationDateLimit(actualDate.toLocalDateTime().plusDays(1));
        Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
        Mockito.when(userRepository.findByEmail("client@gotacar.es")).thenReturn(user);
        Mockito.when(tripOrderRepository.findById(new ObjectId(order.getId()))).thenReturn(order);

        String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        Integer beforePlaces = order.getTrip().getPlaces();
        ResultActions result = mockMvc.perform(post("/cancel_trip_order_request/" + order.getId()).header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(order.getStatus()).isEqualTo("REFUNDED_PENDING");
        assertThat(order.getTrip().getPlaces()).isEqualTo(beforePlaces + order.getPlaces());
    }

    @Test
    void testCancelTripOrder() throws Exception {
        Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
        Mockito.when(tripOrderRepository.findById(new ObjectId(order.getId()))).thenReturn(order);

        String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc.perform(post("/cancel_trip_order/" + order.getId()).header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(order.getStatus()).isEqualTo("REFUNDED");
    }

    @Test
    void testListTripOrderAdmin() throws Exception {
        Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
        Mockito.when(tripOrderRepository.findAll()).thenReturn(Arrays.asList(order));

        String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc.perform(get("/trip_order/list").header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(tripOrderRepository.findAll().size()).isEqualTo(1);
    }

    @Test
    void testShowTripOrderAdmin() throws Exception {
        Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
        Mockito.when(tripOrderRepository.findAll()).thenReturn(Arrays.asList(order));

        String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc.perform(get("/trip_order/show/" + order.getId()).header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
    }

    @Test
    void testListTripOrderUser() throws Exception {
        Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
        Mockito.when(tripOrderRepository.findAll()).thenReturn(Arrays.asList(order));

        String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc.perform(get("/trip_order/list").header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
    }

    @Test
    void testShowTripOrderUser() throws Exception {
        Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
        Mockito.when(tripOrderRepository.findAll()).thenReturn(Arrays.asList(order));

        String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc.perform(get("/trip_order/show/" + order.getId()).header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
    }

}
