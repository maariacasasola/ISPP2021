package com.gotacar.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;


import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
@AutoConfigureMockMvc
public class ComplaintAppealControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ComplaintAppealRepository complaintAppealRepository;

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
            JSONObject sampleObject = new JSONObject();
            sampleObject.appendField("content", "soy tonto");
            sampleObject.appendField("checked", false);

                // Login como driver
                String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg2"))
                                .andReturn().getResponse().getContentAsString();

                org.json.JSONObject json2 = new org.json.JSONObject(response);
                // Obtengo el token
                String token = json2.getString("token");

                // Petición post al controlador
                ResultActions result = mockMvc.perform(post("/complaint_appeal").header("Authorization", token)
                            .contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
                            .accept(MediaType.APPLICATION_JSON));

                String complaint = result.andReturn().getResponse().getContentAsString();

                String[]trim = complaint.split(",");
                trim = trim[1].split(":");
                String id = trim[trim.length-1];

                assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
                assertThat(id).isNotEqualTo("null");
                assertThat(result.andReturn().getResponse().getContentType().equals(ComplaintAppeal.class.toString()));
        }

}
