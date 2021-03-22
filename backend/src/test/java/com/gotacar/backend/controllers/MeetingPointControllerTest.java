package com.gotacar.backend.controllers;

import org.junit.jupiter.api.BeforeAll;
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

import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.MeetingPointRepository;
import com.gotacar.backend.models.User;

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

    @BeforeAll
    static void setUp(){
        User u = new User();
        u.setFirstName("User4");
        u.setLastName("LastName");
        u.setUid("4");
        u.setEmail("user@email.com");
        u.setDni("12345678N");
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_ADMIN");
        u.setRoles(roles);
    }

    @Test
    @WithMockUser(value = "spring")
    public void testCreateMeetingPointAdmin() throws Exception {

        // Construcción del json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("lat", -5.982498103652494);
        sampleObject.appendField("lng", 37.355465467940405);
        sampleObject.appendField("name", "Heliópolis");
        sampleObject.appendField("address", "Calle Ifni, 41012 Sevilla");

        //Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "1")).andReturn().getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        //Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(post("/create_meeting_point").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
        assertThat(meetingPointRepository.findByName("Heliópolis").getAddress()).isEqualTo("Calle Ifni, 41012 Sevilla");
    }

    @Test
    @WithMockUser(value = "spring")
    public void testCreateMeetingPointUser() throws Exception {

        // Construcción del json para el body
        JSONObject sampleObject = new JSONObject();
        sampleObject.appendField("lat", -5.982498103652494);
        sampleObject.appendField("lng", 37.355465467940405);
        sampleObject.appendField("name", "Heliópolis");
        sampleObject.appendField("address", "Calle Ifni, 41012 Sevilla");

        //Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "2")).andReturn().getResponse().getContentAsString();

        org.json.JSONObject json = new org.json.JSONObject(response);
        //Obtengo el token
        String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(post("/create_meeting_point").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
        
    }
	
	@Autowired
	private MockMvc mvc;
	
	
	@Test
	public void testFindAllMeetingPoints() throws Exception{
		RequestBuilder builder = MockMvcRequestBuilders.get("/search_meeting_points");
		ObjectMapper mapper = new ObjectMapper();
		try {
			String resBody = mvc.perform(builder).andReturn().getResponse().getContentAsString();
			List<MeetingPoint> lista = mapper.readValue(resBody, new TypeReference<List<MeetingPoint>>(){});

			this.mvc.perform(builder).andExpect(MockMvcResultMatchers.status().isOk());
			assertThat(lista.get(0).getName()).isEqualTo("Plaza de EspaÃ±a");
			assertThat(lista.get(1).getName()).isEqualTo("Torneo");
			assertThat(lista.get(2).getName()).isEqualTo("Petit Palace Puerta de Triana");
			assertThat(lista.get(3).getName()).isEqualTo("Viapol Center");
			
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
				
	}
}
