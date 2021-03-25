package com.gotacar.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
public class ComplaintAppealControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void ListComplaintAppealsUncheckedTest() throws Exception {
        String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);

        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                get("/complaint_appeals/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

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
    public void ListComplaintAppealsUncheckedTestFailed() throws Exception {
        String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg1")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);

        // Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(
                get("/complaint_appeals/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
    }
}
