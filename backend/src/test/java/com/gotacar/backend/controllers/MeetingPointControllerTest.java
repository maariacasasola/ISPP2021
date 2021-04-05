package com.gotacar.backend.controllers;

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

import net.minidev.json.JSONObject;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.gotacar.backend.models.MeetingPointRepository;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.controllers.MeetingPointControllerTest.TestConfig;

import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.models.MeetingPoint;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
public class MeetingPointControllerTest {

    @Configuration
    static class TestConfig {
        @Bean
        @Primary
        public MeetingPointRepository mockB() {
            MeetingPointRepository mockService = Mockito.mock(MeetingPointRepository.class);
            return mockService;
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MeetingPointRepository meetingPointRepository;

    @MockBean
    private UserRepository userRepository;

    private User user;
    private User admin;
    private User driver;
    private MeetingPoint meetingPoint;

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

        meetingPoint = new MeetingPoint(37.37722160408209, -5.9871317313950705, "41013, Plaza de España, Sevilla",
                "Plaza de España");
        ObjectId pointObjectId = new ObjectId();
        meetingPoint.setId(pointObjectId.toString());
    }

    @Test
    public void testCreateMeetingPointUser() throws Exception {
        Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

        // Construcción del json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("lat", 37.355465467940405);
        sampleObject.appendField("lng", -5.982498103652494);
        sampleObject.appendField("name", "Reina Mercedes");
        sampleObject.appendField("address", "Calle Teba, 41012 Sevilla");

        // Login como usuario
        String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                post("/create_meeting_point").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);

    }

    @Test
    public void testCreateMeetingPointAdmin() throws Exception {
        Mockito.when(meetingPointRepository.findByName("Heliopolis")).thenReturn(
                new MeetingPoint(37.355465467940405, -5.982498103652494, "Calle Ifni, 41012 Sevilla", "Heliopolis"));
        Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

        // Construcción del json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("lat", 37.355465467940405);
        sampleObject.appendField("lng", -5.982498103652494);
        sampleObject.appendField("name", "Heliopolis");
        sampleObject.appendField("address", "Calle Ifni, 41012 Sevilla");

        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
                .getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                post("/create_meeting_point").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(meetingPointRepository.findByName("Heliopolis").getAddress()).isEqualTo("Calle Ifni, 41012 Sevilla");
    }

    @Test
    public void testFindAllMeetingPoints() throws Exception {
        Mockito.when(meetingPointRepository.findAll()).thenReturn(Arrays.asList(meetingPoint));

        RequestBuilder builder = MockMvcRequestBuilders.get("/search_meeting_points");
        ObjectMapper mapper = new ObjectMapper();

        String resBody = mockMvc.perform(builder).andReturn().getResponse().getContentAsString();
        List<MeetingPoint> lista = mapper.readValue(resBody, new TypeReference<List<MeetingPoint>>() {
        });

        this.mockMvc.perform(builder).andExpect(MockMvcResultMatchers.status().isOk());
        assertThat(lista.size()).isEqualTo(1);

    }
}
