package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.gotacar.backend.models.User;

import net.minidev.json.JSONObject;

@SpringBootTest
@AutoConfigureMockMvc
public class TripControllerTest {
	
	@Autowired
    private MockMvc mockMvc;
	
	@BeforeAll
    static void setUp(){
        User u = new User();
        u.setFirstName("User4");
        u.setLastName("LastName");
        u.setUid("4");
        u.setEmail("user@email.com");
        u.setDni("12345678N");
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_DRIVER");
        u.setRoles(roles);
    }
	
	@Test
	@WithMockUser(value = "spring")
	void testCreateTripDriver() throws Exception {
		
		List<String> roles = new ArrayList<>();
		roles.add("ROLE_ADMIN");
		
		JSONObject trip = new JSONObject();
		
		//creamos el punto de inicio
		JSONObject startingPoint = new JSONObject();
		startingPoint.appendField("lng", 37.355465467940405);
		startingPoint.appendField("lat", -5.982498103652494);
		startingPoint.appendField("address", "calle tarfia");
		startingPoint.appendField("name", "start");
		
		//creamos el punto final
		JSONObject endPoint = new JSONObject();
		endPoint.appendField("lng", 37.355465467940405);
		endPoint.appendField("lat", -5.982498103652494);
		endPoint.appendField("address", "calle tarfia");
		endPoint.appendField("name", "start");
		
		//creacion del usuario
		JSONObject user = new JSONObject();
		user.appendField("firstName", "Pepita");
		user.appendField("lastName", "Perez");
		user.appendField("uid", "56789");
		user.appendField("email", "email@gmail.com");
		user.appendField("dni", "12345678I");
		user.appendField("profilePhoto", "http://photo.com");
		user.appendField("birthdate", LocalDate.of(1999, Month.JANUARY, 8));
		user.appendField("roles", roles);
		
		trip.appendField("starting_point", startingPoint);
		trip.appendField("end_point", startingPoint);
		trip.appendField("price", 15);
		trip.appendField("startDate", "2021-06-05T13:30:00.000+00");
		trip.appendField("endingDate", "2021-06-04T13:30:00.000+00");
		trip.appendField("comments", "Muy bien si, muy bien");
		trip.appendField("places", 2);
		
        //Login como conductor
        String response = mockMvc.perform(post("/user").param("uid", "3")).andReturn().getResponse().getContentAsString();
		
        //Obtengo el token
        String token = response.substring(10, response.length()-2);
        
        ResultActions result = mockMvc.perform(post("/create_trip").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content(trip.toJSONString()).accept(MediaType.APPLICATION_JSON));
        
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}
	
	@Test
	@WithMockUser(value = "spring")
	void testCreateTripDriverWrong() throws Exception {
		
		List<String> roles = new ArrayList<>();
		roles.add("ROLE_ADMIN");
		
		JSONObject trip = new JSONObject();
		
		//creamos el punto de inicio
		JSONObject startingPoint = new JSONObject();
		startingPoint.appendField("lng", 37.355465467940405);
		startingPoint.appendField("lat", -5.982498103652494);
		startingPoint.appendField("address", "calle tarfia");
		startingPoint.appendField("name", "start");
		
		//creamos el punto final
		JSONObject endPoint = new JSONObject();
		endPoint.appendField("lng", 37.355465467940405);
		endPoint.appendField("lat", -5.982498103652494);
		endPoint.appendField("address", "calle tarfia");
		endPoint.appendField("name", "start");
		
		trip.appendField("starting_point", startingPoint);
		trip.appendField("end_point", startingPoint);
		trip.appendField("price", 15);
		trip.appendField("startDate", "2021-06-05T13:30:00.000+00");
		trip.appendField("endingDate", "2021-06-04T13:30:00.000+00");
		trip.appendField("comments", "Muy bien si, muy bien");
		trip.appendField("places", 2);
		
        //Login como conductor
        String response = mockMvc.perform(post("/user").param("uid", "1")).andReturn().getResponse().getContentAsString();
		
        //Obtengo el token
        String token = response.substring(10, response.length()-2);
        
        ResultActions result = mockMvc.perform(post("/create_trip").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content(trip.toJSONString()).accept(MediaType.APPLICATION_JSON));
        
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}
	
	

}
