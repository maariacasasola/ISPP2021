package com.gotacar.backend.controllers;

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

import net.minidev.json.JSONObject;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepository;
import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.controllers.ComplaintAppealControllerTest.TestConfig;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class ComplaintAppealControllerTest {

        @Configuration
        static class TestConfig {
                @Bean
                @Primary
                public ComplaintAppealRepository mockB() {
                        ComplaintAppealRepository mockService = Mockito.mock(ComplaintAppealRepository.class);
                        return mockService;
                }
        }

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private UserRepository userRepository;

        @MockBean
        private TripRepository tripRepository;

        @MockBean
        private ComplaintAppealRepository complaintAppealRepository;

        @MockBean
        private ComplaintRepository complaintRepository;

        private User user;
        private User admin;
        private User driver;
        private User driver2;
        private Trip trip;
        private Complaint complaint;
        private ComplaintAppeal appeal;

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
                                "http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757575");
                ObjectId driverObjectId = new ObjectId();
                driver.setId(driverObjectId.toString());

                driver2 = new User("Manuel", "Fernández", "59t8UjqwHhWafrmdI3ZzpmHdod02", "driver2@gotacar.es",
                                "312312312R", null, LocalDate.of(1999, 10, 10), lista3, "645054554",
                                LocalDateTime.of(2021, 06, 04, 13, 30, 24));
                ObjectId driver2ObjectId = new ObjectId();
                driver2.setId(driver2ObjectId.toString());

                user = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client@gotacar.es", "89070336D",
                                "http://dniclient.com", LocalDate.of(1999, 10, 10), lista2, "655757575");
                ObjectId userObjectId = new ObjectId();
                user.setId(userObjectId.toString());

                admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es",
                                "89070360G", "http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1, "655757575");
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

                complaint = new Complaint("title", "content", trip, user, LocalDateTime.of(2021, 03, 29, 12, 27, 00));
                ObjectId complaintObjectId = new ObjectId();
                complaint.setId(complaintObjectId.toString());

                appeal = new ComplaintAppeal("content", false, complaint, driver);
                ObjectId complaintAppealObjectId = new ObjectId();
                appeal.setId(complaintAppealObjectId.toString());
        }

        @Test
        void listComplaintAppealsUncheckedTest() throws Exception {
                Mockito.when(complaintAppealRepository.findByChecked(false)).thenReturn(Arrays.asList(appeal));
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(get("/complaint_appeals/list").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

                String res = result.andReturn().getResponse().getContentAsString();
                int contador = 0;
                while (res.contains("checked")) {
                        res = res.substring(res.indexOf("checked") + "checked".length(), res.length());
                        contador++;
                }

                assertThat(contador).isEqualTo(1);
        }

        @Test
        void listComplaintAppealsUncheckedTestFailed() throws Exception {
                Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

                String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(get("/complaint_appeals/list").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        void acceptComplaintAppealTest() throws Exception {
                Mockito.when(complaintAppealRepository.findById(new ObjectId(appeal.getId()))).thenReturn(appeal);
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
                Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                assertThat(appeal.getChecked()).isFalse();

                // Petición post al controlador
                ResultActions result = mockMvc
                                .perform(post("/complaint_appeals/{complaintAppealId}/accept", appeal.getId())
                                                .header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(appeal.getChecked()).isTrue();
        }

        @Test
        void acceptComplaintAppealTestFailed() throws Exception {
                appeal.setChecked(true);
                Mockito.when(complaintAppealRepository.findById(new ObjectId(appeal.getId()))).thenReturn(appeal);
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc
                                .perform(post("/complaint_appeals/{complaintAppealId}/accept", appeal.getId())
                                                .header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
                assertThat(result.andReturn().getResponse().getErrorMessage())
                                .isEqualTo("Esta apelación ya está resuelta");
        }

        @Test
        void acceptComplaintAppealTestUser() throws Exception {
                Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

                String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc
                                .perform(post("/complaint_appeals/{complaintAppealId}/accept", appeal.getId())
                                                .header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        void rejectComplaintAppealTest() throws Exception {
                Mockito.when(complaintAppealRepository.findById(new ObjectId(appeal.getId()))).thenReturn(appeal);
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                assertThat(appeal.getChecked()).isFalse();

                // Petición post al controlador
                ResultActions result = mockMvc
                                .perform(post("/complaint_appeals/{complaintAppealId}/reject", appeal.getId())
                                                .header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(appeal.getChecked()).isTrue();

        }

        @Test
        void rejectComplaintAppealTestFailed() throws Exception {
                appeal.setChecked(true);
                Mockito.when(complaintAppealRepository.findById(new ObjectId(appeal.getId()))).thenReturn(appeal);
                Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

                String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc
                                .perform(post("/complaint_appeals/{complaintAppealId}/reject", appeal.getId())
                                                .header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
                assertThat(result.andReturn().getResponse().getErrorMessage())
                                .isEqualTo("Esta apelación ya está resuelta");
        }

        @Test
        void rejectComplaintAppealTestUser() throws Exception {
                Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

                String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc
                                .perform(post("/complaint_appeals/{complaintAppealId}/reject", appeal.getId())
                                                .header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        void testCreateComplaintAppealDriver() throws Exception {
                Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
                Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
                Mockito.when(tripRepository.findAll()).thenReturn(Arrays.asList(trip));
                Mockito.when(complaintAppealRepository.findAll()).thenReturn(Arrays.asList(appeal));
                Mockito.when(complaintRepository.findAll()).thenReturn(Arrays.asList(complaint));

                JSONObject sampleObject = new JSONObject();
                sampleObject.appendField("content", "No me daba tiempo a llegar");
                sampleObject.appendField("tripId", trip.getId());

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint-appeal/complaint/create")
                                .header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                String res = result.andReturn().getResponse().getContentAsString();
                int contador = 0;
                while (res.contains("checked")) {
                        res = res.substring(res.indexOf("checked") + "checked".length(), res.length());
                        contador++;
                }

                assertThat(contador).isEqualTo(1);
        }

        @Test
        void testCreateComplaintAppealDriverError() throws Exception {
                Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

                JSONObject sampleObject = new JSONObject();
                sampleObject.appendField("content", "No me daba tiempo a llegar");
                sampleObject.appendField("tripId", trip.getId());

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint-appeal/complaint/create")
                                .header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        void testCreateComplaintAppealDriverByCancelation() throws Exception {
                Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
                Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
                Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);

                JSONObject sampleObject = new JSONObject();
                sampleObject.appendField("content", "No me daba tiempo a llegar");
                sampleObject.appendField("tripId", trip.getId());

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint-appeal/create").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
                                .accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                String res = result.andReturn().getResponse().getContentAsString();
                int contador = 0;
                while (res.contains("checked")) {
                        res = res.substring(res.indexOf("checked") + "checked".length(), res.length());
                        contador++;
                }

                assertThat(contador).isEqualTo(1);
        }

        @Test
        void testCreateComplaintAppealDriverByCancelationFailed() throws Exception {
                Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
                Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
                trip.setDriver(driver2);
                Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);

                JSONObject sampleObject = new JSONObject();
                sampleObject.appendField("content", "No me daba tiempo a llegar");
                sampleObject.appendField("tripId", trip.getId());

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint-appeal/create").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
                                .accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(409);
                assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El conductor no ha ofertado este viaje");
        }

        @Test
        void testCreateComplaintAppealDriverByCancelationError() throws Exception {
                Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

                JSONObject sampleObject = new JSONObject();
                sampleObject.appendField("content", "No me daba tiempo a llegar");
                sampleObject.appendField("tripId", trip.getId());

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                                .getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint-appeal/create").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
                                .accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

}