package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.security.test.context.support.WithMockUser;

import net.minidev.json.JSONObject;

@SpringBootTest
@AutoConfigureMockMvc
public class TripControllerTest {

	@Autowired
	private MockMvc mockMvc;

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
		while (res.contains("startingPoint")) {
			res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
			contador++;
		}

		assertThat(contador).isEqualTo(2);

	}

	@Test
	@WithMockUser(value = "spring")
	void testCreateTripDriver() throws Exception {

		List<String> roles = new ArrayList<>();
		roles.add("ROLE_ADMIN");

		JSONObject trip = new JSONObject();

		// creamos el punto de inicio
		JSONObject startingPoint = new JSONObject();
		startingPoint.appendField("lng", 37.355465467940405);
		startingPoint.appendField("lat", -5.982498103652494);
		startingPoint.appendField("address", "calle tarfia");
		startingPoint.appendField("name", "start");

		// creamos el punto final
		JSONObject endPoint = new JSONObject();
		endPoint.appendField("lng", 37.355465467940405);
		endPoint.appendField("lat", -5.982498103652494);
		endPoint.appendField("address", "calle tarfia");
		endPoint.appendField("name", "start");

		// creacion del usuario
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

		// Login como conductor
		String response = mockMvc.perform(post("/user").param("uid", "3")).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		//Obtengo el token
		String token = json.getString("token");

		ResultActions result = mockMvc
				.perform(post("/create_trip").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(trip.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	@WithMockUser(value = "spring")
	void testCreateTripDriverWrong() throws Exception {

		List<String> roles = new ArrayList<>();
		roles.add("ROLE_ADMIN");

		JSONObject trip = new JSONObject();

		// creamos el punto de inicio
		JSONObject startingPoint = new JSONObject();
		startingPoint.appendField("lng", 37.355465467940405);
		startingPoint.appendField("lat", -5.982498103652494);
		startingPoint.appendField("address", "calle tarfia");
		startingPoint.appendField("name", "start");

		// creamos el punto final
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

		// Login como conductor
		String response = mockMvc.perform(post("/user").param("uid", "1")).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		//Obtengo el token
		String token = json.getString("token");

		ResultActions result = mockMvc
				.perform(post("/create_trip").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(trip.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

    

    @Test
    void testListTrips() throws Exception {
        //Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "1")).andReturn().getResponse().getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		//Obtengo el token
		String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(get("/list_trips").header("Authorization", token));

        // Comprobación de que todo ha ido bien
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

        // Solo podemos acceder al body de la respuesta (json) como String,
        // por eso cuento las veces que aparece la cadena 'startingPoint' (uno por
        // viaje)
        // para saber el número de viajes que devuelve la lista
        String res = result.andReturn().getResponse().getContentAsString();
        int contador = 0;
        while (res.contains("startingPoint")) {
            res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
            contador++;
        }

        assertThat(contador).isEqualTo(4);

    }

    @Test
    void testListTripsFailed() throws Exception {
        //Login como administrador
        String response = mockMvc.perform(post("/user").param("uid", "2")).andReturn().getResponse().getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		//Obtengo el token
		String token = json.getString("token");

        // Petición post al controlador
        ResultActions result = mockMvc.perform(get("/list_trips").header("Authorization", token));

        // Comprobación de que está prohibido
        assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);

    }
}
