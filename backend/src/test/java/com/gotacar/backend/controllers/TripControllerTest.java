package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;


import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSearchTrips() throws Exception {

        // Contrucción del archivo json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("date", "2021-06-04T11:30:24.000+00");
        sampleObject.appendField("places", 1);

        JSONObject startingPoint = new JSONObject();
        startingPoint.appendField("name", "Cerca Triana");
        startingPoint.appendField("address", "Calle cerca de triana");
        startingPoint.appendField("lat", 37.39005423652009);
        startingPoint.appendField("lng", -5.998501215420612);

        sampleObject.appendField("starting_point", startingPoint);

        JSONObject endingPoint = new JSONObject();
        endingPoint.appendField("name", "Cerca Torneo");
        endingPoint.appendField("address", "Calle cerca de torneo");
        endingPoint.appendField("lat", 37.3881289645203);
        endingPoint.appendField("lng", -6.00020437294197);

        sampleObject.appendField("ending_point", endingPoint);

        // Petición post al controlador
        ResultActions result = mockMvc.perform(post("/search_trips").contentType(MediaType.APPLICATION_JSON)
                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        // Comprobación de que todo ha ido bien
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

        // Solo podemos acceder al body de la respuesta (json) como String,
        // por eso cuento las veces que aparece la cadena 'startingPoint' (uno por
        // viaje)
        // para saber el número de viajes que devuelve la lista
        String res = result.andReturn().getResponse().getContentAsString();
        int contador = 0;
        while (res.indexOf("startingPoint") > -1) {
            res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
            contador++;
        }

        assertThat(contador).isEqualTo(2);

    }

    @Test
    public void testFindAllMeetingPoints() throws Exception{
        RequestBuilder builder = MockMvcRequestBuilders.get("/list_trips");
        System.out.println(builder.toString() + "builder");
        ObjectMapper mapper = new ObjectMapper();
        try {
            String resBody = mockMvc.perform(builder).andReturn().getResponse().getContentAsString();
            System.out.println(resBody);
            List<Trip> lista = mapper.readValue(resBody, new TypeReference<List<Trip>>(){});
            System.out.println("b");

            this.mockMvc.perform(builder).andExpect(MockMvcResultMatchers.status().isOk());
            assertThat(lista.size()).isEqualTo(60);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.getCause());
            System.out.println(e.getStackTrace().toString());
        }

    }
    
    @Test
    public void testCancelTripDriver() throws Exception{
    	
    	// Login como conductor
        String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg1")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");
        
        //Obtengo un viaje de este usuraio
        User driver = userRepository.findByUid("h9HmVQqlBQXD289O8t8q7aN2Gzg1");
        
        Trip viaje = tripRepository.findByDriver(driver).get(0);
        
    	JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("id", viaje.getId());
        
        try {
        	ResultActions result = mockMvc.perform(post("/cancel_trip_driver").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
    	
        	//compruebo que obtengo una respuesta correcta
        	assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        	assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo(null);
           

        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.getCause());
            System.out.println(e.getStackTrace().toString());
        }

    }
    
    @Test
    public void testCancelTripDriverRepeated() throws Exception{
    	
    	// Login como conductor
        String response = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg1")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        // Obtengo el token
        String token = json.getString("token");
       
        
        //Obtengo un viaje de este usuraio
        User driver = userRepository.findByUid("h9HmVQqlBQXD289O8t8q7aN2Gzg1");
        
        Trip viaje = tripRepository.findByDriver(driver).get(0);
        
    	JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("id", viaje.getId());
        
        try {
        	ResultActions result = mockMvc.perform(post("/cancel_trip_driver").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
    	
        	//compruebo que obtengo una respuesta correcta
        	assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("El viaje ya está cancelado");
           

        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.getCause());
            System.out.println(e.getStackTrace().toString());
        }

    }
    @Test
    public void testCancelTripDriverWrongUser() throws Exception{
    	
    	//login como conductor ajeno al viaje
    	String responseW = mockMvc.perform(post("/user").param("uid", "h9HmVQqlBQXD289O8t8q7aN2Gzg1")).andReturn()
                .getResponse().getContentAsString();

        org.json.JSONObject jsonW = new org.json.JSONObject(responseW);
        // Obtengo el token
        String tokenW = jsonW.getString("token");       
        
        //Obtengo un viaje de este usuraio
        User driver = userRepository.findByUid("h9HmVQqlBQXD289O8t8q7aN2Gzg2");
        
        Trip viaje = tripRepository.findByDriver(driver).get(0);
        
    	JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("id", viaje.getId());
        
        try {
        	ResultActions result = mockMvc.perform(post("/cancel_trip_driver").header("Authorization", tokenW).contentType(MediaType.APPLICATION_JSON)
                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
    	
        	//compruebo que obtengo una respuesta correcta
        	assertThat(result.andReturn().getResponse().getErrorMessage()).isEqualTo("Usted no ha realizado este viaje");
           

        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println(e.getCause());
            System.out.println(e.getStackTrace().toString());
        }

    }


}
