package com.gotacar.backend.controllers;

import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.List;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import net.minidev.json.JSONObject;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class ComplaintControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Test
    public void CreateComplaintTest() throws Exception {
        // Construcción del json para el body
        List<Trip> lt = tripRepository.findAll();

        JSONObject sampleObject = new JSONObject();

        sampleObject.appendField("title", "Queja test");
        sampleObject.appendField("content", "Queja para el test");
        sampleObject.appendField("tripId", lt.get(5).getId());

        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE8")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);

        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                post("/complaints/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(complaintRepository.findAll().stream()).anyMatch(c -> c.getContent().equals("Queja para el test")
                && c.getTitle().equals("Queja test") && c.getTrip() != null);
    }

    
    @Test
    public void ListComplaints() throws Exception {
       String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2"))
                                .andReturn().getResponse().getContentAsString();
        RequestBuilder builder = MockMvcRequestBuilders.get("/complaints/list");
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("hola");
 try {
            String resBody = mockMvc.perform(builder).andReturn().getResponse().getContentAsString();
            List<Complaint> lista = mapper.readValue(resBody, new TypeReference<List<Complaint>>() {
            });

            this.mockMvc.perform(builder).andExpect(MockMvcResultMatchers.status().isOk());
            assertThat(lista.size()).isEqualTo(4);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
                
    }

    @Test
    public void CreateComplaintUserErrorTest() throws Exception {
        // Construcción del json para el body
        List<Trip> lt = tripRepository.findAll();

        JSONObject sampleObject = new JSONObject();

        sampleObject.appendField("title", "Queja test");
        sampleObject.appendField("content", "Queja para el test");
        sampleObject.appendField("tripId", lt.get(5).getId());

        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE7")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);

        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                post("/complaints/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
        assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("Usted no ha realizado este viaje");
   }

   @Test
    public void CreateComplaintTripErrorTest() throws Exception {
        // Construcción del json para el body
        List<Trip> lt = tripRepository.findAll();

        JSONObject sampleObject = new JSONObject();

        sampleObject.appendField("title", "Queja test");
        sampleObject.appendField("content", "Queja para el test");
        sampleObject.appendField("tripId", lt.get(1).getId());

        // Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE7")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);

        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                post("/complaints/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                        .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
        assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El viaje aún no se ha realizado");
   }

}