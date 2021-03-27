package com.gotacar.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.ComplaintRepository;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
public class ComplaintAppealControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ComplaintAppealRepository complaintAppealRepository;

        @Autowired
        private ComplaintRepository complaintRepository;

        @Test
        public void listComplaintAppealsUncheckedTest() throws Exception {

                String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2"))
                                .andReturn().getResponse().getContentAsString();

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

                assertThat(contador).isEqualTo(2);
        }

        @Test
        public void listComplaintAppealsUncheckedTestFailed() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg1"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(get("/complaint_appeals/list").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        public void acceptComplaintAppealTest() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                assertThat(complaintAppealRepository.findAll().get(0).getChecked()).isEqualTo(false);

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeals/{complaintAppealId}/accept",
                                complaintAppealRepository.findAll().get(0).getId()).header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(complaintAppealRepository.findAll().get(0).getChecked()).isEqualTo(true);

        }

        @Test
        public void acceptComplaintAppealTestFailed() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeals/{complaintAppealId}/accept",
                                complaintAppealRepository.findAll().get(1).getId()).header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(423);
                assertThat(result.andReturn().getResponse().getErrorMessage())
                                .isEqualTo("Esta apelación ya está resuelta");
        }

        @Test
        public void acceptComplaintAppealTestUser() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeals/{complaintAppealId}/accept",
                                complaintAppealRepository.findAll().get(0).getId()).header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        public void rejectComplaintAppealTest() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                assertThat(complaintAppealRepository.findAll().get(2).getChecked()).isEqualTo(false);

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeals/{complaintAppealId}/reject",
                                complaintAppealRepository.findAll().get(2).getId()).header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(complaintAppealRepository.findAll().get(2).getChecked()).isEqualTo(true);

        }

        @Test
        public void rejectComplaintAppealTestFailed() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeals/{complaintAppealId}/reject",
                                complaintAppealRepository.findAll().get(1).getId()).header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(423);
                assertThat(result.andReturn().getResponse().getErrorMessage())
                                .isEqualTo("Esta apelación ya está resuelta");
        }

        @Test
        public void rejectComplaintAppealTestUser() throws Exception {
                String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json = new org.json.JSONObject(response);

                // Obtengo el token
                String token = json.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeals/{complaintAppealId}/reject",
                                complaintAppealRepository.findAll().get(2).getId()).header("Authorization", token)
                                                .contentType(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        }

        @Test
        @WithMockUser(value = "spring")
        public void testCreateComplaintAppealDriver() throws Exception {
                List<Complaint> muertos = new ArrayList<>();
                muertos = complaintRepository.findAll();
                final String value = muertos.get(0).getId(); // whatever the final "value" is.
                final ObjectMapper objectMapper = new ObjectMapper();
                List<String> list = new ArrayList<>();
                list.add("complaint");
                list.add("id");
                ObjectNode json = null;
                for (int i = list.size() - 1; i >= 0; i--) {
                        final String prop = list.get(i);
                        final ObjectNode objectNode = objectMapper.createObjectNode();

                        if (json == null) {
                                objectNode.put(prop, value);
                        } else {
                                objectNode.put(prop, json);
                        }
                        json = objectNode;

                }
                json.put("content", "gilipollas");
                json.put("checked", "false");
                System.out.println("final" + json);

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg1"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeal").header("Authorization", token)
                                .contentType(MediaType.APPLICATION_JSON).content(json.toString())
                                .accept(MediaType.APPLICATION_JSON));

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(result.andReturn().getResponse().getContentType().equals(ComplaintAppeal.class.toString()));
        }

}
