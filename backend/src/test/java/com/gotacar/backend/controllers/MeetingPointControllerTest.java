package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.MeetingPoint;




import java.util.List;


@SpringBootTest
@AutoConfigureMockMvc
public class MeetingPointControllerTest {
	
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
