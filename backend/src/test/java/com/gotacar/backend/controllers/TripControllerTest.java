package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

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
        while (res.indexOf("startingPoint") > -1) {
            res = res.substring(res.indexOf("startingPoint") + "startingPoint".length(), res.length());
            contador++;
        }

        assertThat(contador).isEqualTo(2);

    }
}
