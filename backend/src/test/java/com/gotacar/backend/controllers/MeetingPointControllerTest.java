package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.Arrays;
import java.util.List;

import com.gotacar.backend.models.MeetingPointRepository;
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
@ActiveProfiles("test")
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
public class MeetingPointControllerTest {

    @Profile("test")
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

    @Test
    public void testCreateMeetingPointUser() throws Exception {

        // Construcción del json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("lat", 37.355465467940405);
        sampleObject.appendField("lng", -5.982498103652494);
        sampleObject.appendField("name", "Reina Mercedes");
        sampleObject.appendField("address", "Calle Teba, 41012 Sevilla");

        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1")).andReturn()
                .getResponse().getContentAsString();

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

        // Construcción del json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("lat", 37.355465467940405);
        sampleObject.appendField("lng", -5.982498103652494);
        sampleObject.appendField("name", "Heliopolis");
        sampleObject.appendField("address", "Calle Ifni, 41012 Sevilla");

        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2")).andReturn()
                .getResponse().getContentAsString();

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
        MeetingPoint point = new MeetingPoint(37.355465467940405, -5.982498103652494, "Calle Ifni, 41012 Sevilla", "Heliopolis");
        Mockito.when(meetingPointRepository.findAll()).thenReturn(Arrays.asList(point));

        RequestBuilder builder = MockMvcRequestBuilders.get("/search_meeting_points");
        ObjectMapper mapper = new ObjectMapper();

        String resBody = mockMvc.perform(builder).andReturn().getResponse().getContentAsString();
        List<MeetingPoint> lista = mapper.readValue(resBody, new TypeReference<List<MeetingPoint>>() {
        });

        this.mockMvc.perform(builder).andExpect(MockMvcResultMatchers.status().isOk());
        assertThat(lista.size()).isEqualTo(1);

    }


}
