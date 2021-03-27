package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import net.minidev.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.gotacar.backend.models.ComplaintRepository;


@SpringBootTest
@AutoConfigureMockMvc
public class ComplaintAppealControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Test
    @WithMockUser(value = "spring")
    public void testCreateComplaintAppealDriver() throws Exception {

        List<String> data = new ArrayList<>();
        data.add("complaint");
        data.add("id");
        data.add("content");
        data.add("checked");

        List<String> datos = new ArrayList<>();
        datos.add("1");
        datos.add("Porque spy gilipollas");
        datos.add("false");
        Boolean flag = false;
        
        Map<String, String> mydata = new HashMap<>();
        Map<String, JSONObject> newdata = new HashMap<>();
        JSONObject result = new JSONObject();

        for (int i = 0; i < data.size(); i++) {
            if (flag) {
                mydata.put(data.get(i), datos.get(0));
                result = generateJson(mydata);
                flag = false;
            } else {
                flag = data.get(i)=="complaint"?true:false;
                if (!flag){
                    newdata.put(data.get(i), result.appendField(data.get(i),datos.get(i)));
                }else{
                    newdata.put(data.get(i), result);
                    
                }
                System.out.println(result);
                    result = generateJson(newdata);
                    newdata.clear();
                 

            }
        }
        System.out.println(result);
        // Login como administrador
        // String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1")).andReturn()
        //         .getResponse().getContentAsString();

        // org.json.JSONObject json = new org.json.JSONObject(response);
        // // Obtengo el token
        // String token = json.getString("token");

        // // Petición post al controlador
        // ResultActions result = mockMvc.perform(
        //         post("/complaint_appeal").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
        //                 .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        // assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        // assertThat(result.andReturn().getResponse().getContentType().equals(ComplaintAppeal.class.toString()));

    }
    private static JSONObject generateJson(Map<String,?> data) {
        return new JSONObject(data);
    }
}
