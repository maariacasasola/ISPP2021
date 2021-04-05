package com.gotacar.backend.controllers;

import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

import static org.assertj.core.api.Assertions.assertThat;

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
import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.controllers.ComplaintControllerTest.TestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import net.minidev.json.JSONObject;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
public class ComplaintControllerTest {

        @Configuration
        static class TestConfig {
                @Bean
                @Primary
                public ComplaintRepository mockB() {
                        ComplaintRepository mockService = Mockito.mock(ComplaintRepository.class);
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

        @MockBean
        private ComplaintRepository complaintRepository;

        private User user;
        private User admin;
        private User driver;
        private Trip trip;
        private Complaint complaint;

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

                admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es",
                                "89070360G", "http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1);
                ObjectId adminObjectId = new ObjectId();
                admin.setId(adminObjectId.toString());

                Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917,
                                -5.96211306033204);
                Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958,
                                -5.976345387146261);
                trip = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
                                LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana",
                                3, driver);
                ObjectId tripObjectId = new ObjectId();
                trip.setId(tripObjectId.toString());

                complaint = new Complaint("title", "content", trip, user, LocalDateTime.of(2021, 05, 24, 16, 30, 00));
                ObjectId complaintObjectId = new ObjectId();
                complaint.setId(complaintObjectId.toString());

        }

        @Test
        public void ListComplaintsTest() throws Exception {
                Mockito.when(complaintRepository.findAll()).thenReturn(Arrays.asList(complaint));
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                ResultActions result = mockMvc.perform(get("/complaints/list").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

                String res = result.andReturn().getResponse().getContentAsString();
                int contador = 0;
                while (res.contains("trip")) {
                        res = res.substring(res.indexOf("trip") + "trip".length(), res.length());
                        contador++;
                }

                assertThat(contador).isEqualTo(2);
        }

        @Test
        public void penalizeTest() throws Exception {
                Mockito.when(complaintRepository.findById(new ObjectId(complaint.getId()))).thenReturn(complaint);
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
                Mockito.when(tripRepository.findAll()).thenReturn(Arrays.asList(trip));

                JSONObject sampleObject = new JSONObject();
                sampleObject.appendField("id_complaint", complaint.getId());
                sampleObject.appendField("date_banned", "2022-06-04T13:30:00.000+00");

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);

                String token = json2.getString("token");

                ResultActions result = mockMvc.perform(post("/penalize").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
                                .accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(complaint.getStatus()).isEqualTo("ACCEPTED");
                assertThat(result.andReturn().getResponse().getContentType().equals(User.class.toString()));
                assertThat(trip.getDriver().getBannedUntil()).isNotNull();

        }

        @Test
        public void refuseTest() throws Exception {
                Mockito.when(complaintRepository.findById(new ObjectId(complaint.getId()))).thenReturn(complaint);
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);

                String token = json2.getString("token");

                ResultActions result = mockMvc.perform(post("/refuse/{complaintId}", complaint.getId())
                                .header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(complaint.getStatus()).isEqualTo("REFUSED");
        }

        // @Test
        // public void CreateComplaintTest() throws Exception {
        // ObjectId tripObjectId = new ObjectId();
        // trip.setId(tripObjectId.toString());
        // ObjectId userObjectId = new ObjectId();
        // user.setId(userObjectId.toString());
        // order = new TripOrder(trip, user, LocalDateTime.of(2021, 05, 24, 15, 00, 00),
        // 220, "payment_intent", 1);
        // Mockito.when(tripRepository.findById(tripObjectId)).thenReturn(trip);
        // Mockito.when(tripOrderRepository.userHasMadeTrip(new
        // ObjectId(order.getTrip().getId()), new
        // ObjectId(order.getUser().getId()))).thenReturn(Arrays.asList(order));

        // // Construcción del json para el body
        // JSONObject sampleObject = new JSONObject();
        // sampleObject.appendField("title", "Queja test");
        // sampleObject.appendField("content", "Queja para el test");
        // sampleObject.appendField("tripId", tripObjectId.toString());

        // // Login como administrador
        // String response = mockMvc.perform(post("/user").param("uid",
        // "qG6h1Pc4DLbPTTTKmXdSxIMEUUE8"))
        // .andReturn().getResponse().getContentAsString();
        // org.json.JSONObject json = new org.json.JSONObject(response);

        // // Obtengo el token
        // String token = json.getString("token");

        // // Petición post al controlador
        // ResultActions result =
        // mockMvc.perform(post("/complaints/create").header("Authorization", token)
        // .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
        // .accept(MediaType.APPLICATION_JSON));

        // String complaint = result.andReturn().getResponse().getContentAsString();

        // String[] trim = complaint.split(",");
        // trim = trim[0].split(":");
        // String id = trim[trim.length - 1];

        // assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        // assertThat(id).isNotEqualTo("null");
        // assertThat(result.andReturn().getResponse().getContentType().equals(Complaint.class.toString()));
        // }

        // @Test
        // public void CreateComplaintUserErrorTest() throws Exception {
        // // Construcción del json para el body
        // List<Trip> lt = tripRepository.findAll();

        // JSONObject sampleObject = new JSONObject();

        // sampleObject.appendField("title", "Queja test");
        // sampleObject.appendField("content", "Queja para el test");
        // sampleObject.appendField("tripId", lt.get(5).getId());

        // // Login como administrador
        // String response = mockMvc.perform(post("/user").param("uid",
        // "qG6h1Pc4DLbPTTTKmXdSxIMEUUE7"))
        // .andReturn().getResponse().getContentAsString();

        // org.json.JSONObject json = new org.json.JSONObject(response);

        // // Obtengo el token
        // String token = json.getString("token");

        // // Petición post al controlador
        // ResultActions result =
        // mockMvc.perform(post("/complaints/create").header("Authorization", token)
        // .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
        // .accept(MediaType.APPLICATION_JSON));
        // assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
        // assertThat(result.andReturn().getResponse().getErrorMessage())
        // .isEqualTo("Usted no ha realizado este viaje");
        // }

        // @Test
        // public void CreateComplaintTripErrorTest() throws Exception {
        // // Construcción del json para el body
        // List<Trip> lt = tripRepository.findAll();

        // JSONObject sampleObject = new JSONObject();

        // sampleObject.appendField("title", "Queja test");
        // sampleObject.appendField("content", "Queja para el test");
        // sampleObject.appendField("tripId", lt.get(1).getId());

        // // Login como administrador
        // String response = mockMvc.perform(post("/user").param("uid",
        // "qG6h1Pc4DLbPTTTKmXdSxIMEUUE7"))
        // .andReturn().getResponse().getContentAsString();

        // org.json.JSONObject json = new org.json.JSONObject(response);

        // // Obtengo el token
        // String token = json.getString("token");

        // // Petición post al controlador
        // ResultActions result =
        // mockMvc.perform(post("/complaints/create").header("Authorization", token)
        // .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
        // .accept(MediaType.APPLICATION_JSON));
        // assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
        // assertThat(result.andReturn().getResponse().getErrorMessage())
        // .isEqualTo("El viaje aún no se ha realizado");
        // }

}
