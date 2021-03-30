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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import net.minidev.json.JSONObject;

import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;
import com.gotacar.backend.controllers.MeetingPointControllerTest.TestConfig;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
public class TripControllerTest {

    @Profile("test")
    @Configuration
    static class TestConfig {
        @Bean
        @Primary
        public TripRepository mockB() {
            TripRepository mockService = Mockito.mock(TripRepository.class);
            return mockService;
        }

        @Bean
        public UserRepository mockU() {
            UserRepository mockService = Mockito.mock(UserRepository.class);
            return mockService;
        }

        @Bean
        public TripOrderRepository mockTO() {
            TripOrderRepository mockService = Mockito.mock(TripOrderRepository.class);
            return mockService;
        }

    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripRepository tripRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private TripOrderRepository tripOrderRepository;

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
    public void testFindAllTrips() throws Exception {
        Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
        Mockito.when(tripRepository.findAll()).thenReturn(java.util.Arrays.asList(trip));

        String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        String token = json.getString("token");

        ResultActions result = mockMvc
                .perform(get("/list_trips").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

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
    public void testCancelTripDriver() throws Exception {
        Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
        Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
        Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
        Mockito.when(tripOrderRepository.findByTrip(trip)).thenReturn(Arrays.asList(order));

        // Login como conductor
        String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");

        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("id", trip.getId());

        ResultActions result = mockMvc.perform(
                post("/cancel_trip_driver").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        // compruebo que obtengo una respuesta correcta
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo(null);
    }

    @Test
    public void testCancelTripDriverRepeated() throws Exception {
        trip.setCanceled(true);
        Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
        Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
        Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);
        Mockito.when(tripOrderRepository.findByTrip(trip)).thenReturn(Arrays.asList(order));

        // Login como conductor
        String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");

        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("id", trip.getId());

        ResultActions result = mockMvc.perform(
                post("/cancel_trip_driver").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        // compruebo que obtengo una respuesta correcta
        assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El viaje ya está cancelado");

    }

    // @Test
    // void testSearchTrips() throws Exception {

    //     // Contrucción del archivo json para el body
    //     JSONObject sampleObject = new JSONObject();
    //     sampleObject.appendField("date", "2021-06-04T11:30:24.000+00");
    //     sampleObject.appendField("places", 1);

    //     JSONObject startingPoint = new JSONObject();
    //     startingPoint.appendField("name", "Cerca Triana");
    //     startingPoint.appendField("address", "Calle cerca de triana");
    //     startingPoint.appendField("lat", 37.39005423652009);
    //     startingPoint.appendField("lng", -5.998501215420612);

    //     sampleObject.appendField("starting_point", startingPoint);

    //     JSONObject endingPoint = new JSONObject();
    //     endingPoint.appendField("name", "Cerca Torneo");
    //     endingPoint.appendField("address", "Calle cerca de torneo");
    //     endingPoint.appendField("lat", 37.3881289645203);
    //     endingPoint.appendField("lng", -6.00020437294197);

    //     sampleObject.appendField("ending_point", endingPoint);

    //     // Petición post al controlador
    //     ResultActions result = mockMvc.perform(post("/search_trips").contentType(MediaType.APPLICATION_JSON)
    //             .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

    //     // Comprobación de que todo ha ido bien
    //     assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

    //     // Solo podemos acceder al body de la respuesta (json) como String,
    //     // por eso cuento las veces que aparece la cadena 'startingPoint' (uno por
    //     // viaje)
    //     // para saber el número de viajes que devuelve la lista
    //     String res = result.andReturn().getResponse().getContentAsString();
    //     int contador = 0;
    //     while (res.indexOf("startingPoint") > -1) {
    //         res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
    //         contador++;
    //     }

    //     assertThat(contador).isEqualTo(2);

    // }

}
