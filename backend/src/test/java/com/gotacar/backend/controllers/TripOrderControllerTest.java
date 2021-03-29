package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.List;

import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@SpringBootTest
@AutoConfigureMockMvc
public class TripOrderControllerTest {

    @Autowired
	private MockMvc mockMvc;

    @Autowired
    private TripOrderRepository tripOrderRepository;

    @Test
    public void testListTripOrders() throws Exception {
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE2")).andReturn().getResponse().getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

        ResultActions result = mockMvc.perform(get("/list_trip_orders").header("Authorization", token));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

        String res = result.andReturn().getResponse().getContentAsString();
        int contador = 0;
        while (res.contains("startingPoint")) {
            res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
            contador++;
        }

        assertThat(contador).isEqualTo(2);
    }

    @Test
    public void testCancelTripOrderRequest() throws Exception {
        String response = mockMvc.perform(post("/user").param("uid", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE2")).andReturn().getResponse().getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

        List<TripOrder> lista = tripOrderRepository.findByUserUid("qG6h1Pc4DLbPTTTKmXdSxIMEUUE2");
        String id = lista.get(0).id;

        mockMvc.perform(get("/cancel_trip_order_request/"+id).header("Authorization", token));

        ObjectId tripOrderObjectId = new ObjectId(id);
        TripOrder tripOrder = tripOrderRepository.findById(tripOrderObjectId);

        assertThat(tripOrder.status).isEqualTo("REFUNDED_PENDING");
    }

    @Test
    public void testCancelTripOrder() throws Exception {
        String response = mockMvc.perform(post("/user").param("uid", "Ej7NpmWydRWMIg28mIypzsI4BgM2")).andReturn().getResponse().getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");
        
        List<TripOrder> lista = tripOrderRepository.findByUserUid("qG6h1Pc4DLbPTTTKmXdSxIMEUUE2");
        String id = lista.get(0).id;

        mockMvc.perform(get("/cancel_trip_order/"+id).header("Authorization", token));

        ObjectId tripOrderObjectId = new ObjectId(id);
        TripOrder tripOrder = tripOrderRepository.findById(tripOrderObjectId);

        assertThat(tripOrder.status).isEqualTo("REFUNDED");
    }
    
}