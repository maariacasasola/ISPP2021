package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.List;

import com.gotacar.backend.models.MeetingPointRepository;

import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.MeetingPoint;

@SpringBootTest
@AutoConfigureMockMvc
public class MeetingPointControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MeetingPointRepository meetingPointRepository;

    @Test
    @WithMockUser(value = "spring")
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
    @WithMockUser(value = "spring")
    public void testCreateMeetingPointAdmin() throws Exception {

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
        RequestBuilder builder = MockMvcRequestBuilders.get("/search_meeting_points");
        ObjectMapper mapper = new ObjectMapper();
        try {
            String resBody = mockMvc.perform(builder).andReturn().getResponse().getContentAsString();
            List<MeetingPoint> lista = mapper.readValue(resBody, new TypeReference<List<MeetingPoint>>() {
            });

            this.mockMvc.perform(builder).andExpect(MockMvcResultMatchers.status().isOk());
            assertThat(lista.size()).isEqualTo(7);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }

/*
    @Test
    @WithMockUser(value = "spring")
    public void testDeleteMeetingPoint() throws Exception {
        //construyo en json
        JSONObject sampleObject = new JSONObject();

        //obtener un mp para borrar
        MeetingPoint mp = MeetingPointRepository.findAll().get(0);
        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");
        // Llamo al controlador para borrar
        String mpId = mp.getId();
        ResultActions result = mockMvc.perform(
        post("/delete_meeting_point/" + mpId).header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

       
        assertThrows(meetingPointRepository.findById(mpId));
        System.out.println(e.getMessage());
        
    }*/
}
