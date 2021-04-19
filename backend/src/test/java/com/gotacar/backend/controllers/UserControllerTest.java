package com.gotacar.backend.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.gotacar.backend.BackendApplication;
import com.gotacar.backend.controllers.TripControllerTest.TestConfig;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.trip.TripRepository;
import com.gotacar.backend.models.tripOrder.TripOrder;
import com.gotacar.backend.models.tripOrder.TripOrderRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import net.minidev.json.JSONObject;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc
@ContextConfiguration(classes = { TestConfig.class, BackendApplication.class })
class UserControllerTest {

	@Configuration
	static class TestConfig {
		@Bean
		@Primary
		public UserRepository mockB() {
			UserRepository mockService = Mockito.mock(UserRepository.class);
			return mockService;
		}
	}

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private TripRepository tripRepository;

	@MockBean
	private TripOrderRepository tripOrderRepository;

	private User user;
	private User user1;
	private User admin;
	private User driver;
	private User driver2;
	private Trip trip;
	private Trip trip1;
	private Trip trip2;
	private TripOrder order;
	private TripOrder tripOrder1;
	private TripOrder tripOrder2;

	@BeforeEach
	void setUp() {
		List<String> lista1 = new ArrayList<String>();
		lista1.add("ROLE_ADMIN");
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("ROLE_CLIENT");
		lista3.add("ROLE_DRIVER");

		driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver1@gotacar.es", "89070310K",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757575");
		ObjectId driverObjectId1 = new ObjectId();
		driver.setId(driverObjectId1.toString());

		driver2 = new User("Manuel", "Fernández", "h9HmVQqlBQXD289O8t8q7aN2Gzg2", "driver2@gmail.com", "312312312R",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista3, "655757575");
		ObjectId driverObjectId2 = new ObjectId();
		driver2.setId(driverObjectId2.toString());

		user = new User("Martín", "Romero", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE1", "client1@gotacar.es", "89070336D",
				"http://dniclient.com", LocalDate.of(1999, 10, 10), lista2, "655757575");
		ObjectId userObjectId = new ObjectId();
		user.setId(userObjectId.toString());

		user1 = new User("Manolo", "Escibar", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE2", "client1@gotacar.es", "89070338D",
				"http://dniclient.com", LocalDate.of(1999, 11, 10), lista2, "655757575");
		ObjectId user1ObjectId = new ObjectId();
		user1.setId(user1ObjectId.toString());

		admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es", "89070360G",
				"http://dniadmin.com", LocalDate.of(1999, 10, 10), lista1, "655757575");
		ObjectId adminObjectId = new ObjectId();
		admin.setId(adminObjectId.toString());

		Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
		Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958, -5.976345387146261);
		trip = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver);
		ObjectId tripObjectId = new ObjectId();
		trip.setId(tripObjectId.toString());

		order = new TripOrder(trip, user, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
		ObjectId orderObjectId = new ObjectId();
		order.setId(orderObjectId.toString());

		trip1 = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver);
		ObjectId tripObjectId1 = new ObjectId();
		trip1.setId(tripObjectId1.toString());

		trip2 = new Trip(location1, location2, 220, LocalDateTime.of(2021, 05, 24, 16, 00, 00),
				LocalDateTime.of(2021, 05, 24, 16, 15, 00), "Viaje desde Cerro del Águila hasta Triana", 3, driver2);
		ObjectId tripObjectId2 = new ObjectId();
		trip2.setId(tripObjectId2.toString());

		tripOrder1 = new TripOrder(trip1, user1, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
		ObjectId orderObjectId1 = new ObjectId();
		tripOrder1.setId(orderObjectId1.toString());

		tripOrder2 = new TripOrder(trip2, driver, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "", 1);
		ObjectId orderObjectId2 = new ObjectId();
		tripOrder2.setId(orderObjectId2.toString());
	}

	@Test
	void testUserController() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		mockMvc.perform(post("/user").param("uid", admin.getUid())).andExpect(status().isOk());
	}

	@Test
	void testListEnrolledUsers() throws Exception {
		List<User> lista = new ArrayList<User>();
		lista.add(driver);
		lista.add(driver2);
		lista.add(user);
		lista.add(user1);
		Mockito.when(userRepository.findByRolesContaining("ROLE_CLIENT")).thenReturn(lista);
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/enrolled-user/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		String res = result.andReturn().getResponse().getContentAsString();
		assertThat(res.contains("ROLE_ADMIN")).isFalse();

	}

	// NEGATIVO Test entra dentro del catch
	@Test
	void testListEnrolledUsersError() throws Exception {
		List<User> lista = new ArrayList<User>();
		lista.add(driver);
		lista.add(driver2);
		lista.add(user);
		lista.add(user1);
		Mockito.when(userRepository.findByRolesContaining("ROLE_CLIENT")).thenThrow(new RuntimeException());
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/enrolled-user/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	void deleteAccountNothing() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
		Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
		Mockito.when(tripRepository.findByDriverAndCanceled(user, false)).thenReturn(new ArrayList<Trip>());
		Mockito.when(tripOrderRepository.findByUserAndStatus(user, "PROCCESSING"))
				.thenReturn(new ArrayList<TripOrder>());

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				post("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	void testRegister() throws Exception {
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Nombre");
		sampleObject.appendField("lastName", "Apellido");
		sampleObject.appendField("uid", "Ej7NpmWydJOS3g28mIypzsI4BgE8");
		sampleObject.appendField("email", "test1234@gmail.com");
		sampleObject.appendField("dni", "87654321E");
		sampleObject.appendField("profilePhoto", "htpps://photoDni.com");
		sampleObject.appendField("birthdate", "1990-11-11");
		sampleObject.appendField("phone", "655656565");

		// hacemos el post
		ResultActions result = mockMvc.perform(post("/user/register").contentType(MediaType.APPLICATION_JSON)
				.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos el resultado
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	void testRegisterError() throws Exception {
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("birthdate", "1990-11-11");
		sampleObject.appendField("phone", "655656565");

		// hacemos el post
		ResultActions result = mockMvc.perform(post("/user/register").contentType(MediaType.APPLICATION_JSON)
				.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos el resultado
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	void testRegisterAsClient() throws Exception {
		// Obtenemos el rol de usuario
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");

		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Usuario");
		sampleObject.appendField("lastName", "Ejemplo");
		sampleObject.appendField("uid", "Ej9NpmWydJOS3g28mIyrbbI4BgA2");
		sampleObject.appendField("email", "test15678@gmail.com");
		sampleObject.appendField("dni", "55444321E");
		sampleObject.appendField("profilePhoto", "htpps://photoDni.com");
		sampleObject.appendField("birthdate", "1990-11-11");
		sampleObject.appendField("phone", "655656565");

		// hacemos el post
		ResultActions result = mockMvc
				.perform(post("/user/register").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos que no nos deja registrarnos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	void testRegisterAsDriver() throws Exception {
		// Obtenemos el rol de conductor
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(user);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");

		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Usuario");
		sampleObject.appendField("lastName", "Ejemplo");
		sampleObject.appendField("uid", "Ej9NpmWydJOS3g28mIysfcI4BgX9");
		sampleObject.appendField("email", "test1907@gmail.com");
		sampleObject.appendField("dni", "55444321E");
		sampleObject.appendField("profilePhoto", "htpps://photoDni.com");
		sampleObject.appendField("birthdate", "1990-11-11");

		// hacemos el post
		ResultActions result = mockMvc
				.perform(post("/user/register").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos que no nos deja registrarnos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	void testCurrentUser() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByEmail(admin.getEmail())).thenReturn(admin);

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");

		// Petición post al controlador
		ResultActions result = mockMvc.perform(get("/current_user").header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON));
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	public void testUpdateDataClient() throws Exception {
		// Obtenemos el rol de usuario
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
		Mockito.when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Martín");
		sampleObject.appendField("lastName", "Romero");
		sampleObject.appendField("email", "client1@gotacar.es");
		sampleObject.appendField("profilePhoto", "ejemploFoto.com");
		sampleObject.appendField("birthdate", "2000-06-04");
		sampleObject.appendField("phone", "655656565");
		sampleObject.appendField("dni", "54545454N");

		// hacemos el post
		ResultActions result = mockMvc
				.perform(post("/user/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos los datos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}
	
	//NEGATIVO lanza error
	@Test
	public void testUpdateDataClientError() throws Exception {
		// Obtenemos el rol de usuario
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
		Mockito.when(userRepository.findByEmail(user.getEmail())).thenThrow(new RuntimeException());

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Martín");
		sampleObject.appendField("lastName", "Romero");
		sampleObject.appendField("email", "client1@gotacar.es");
		sampleObject.appendField("profilePhoto", "ejemploFoto.com");
		sampleObject.appendField("birthdate", "2000-06-04");
		sampleObject.appendField("phone", "655656565");
		sampleObject.appendField("dni", "54545454N");

		// hacemos el post
		ResultActions result = mockMvc
				.perform(post("/user/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos los datos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	public void testUpdateDataDriver() throws Exception {
		// Obtenemos el rol de usuario
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Martín");
		sampleObject.appendField("lastName", "Romero");
		sampleObject.appendField("email", "driver@gotacar.es");
		sampleObject.appendField("birthdate", "2000-06-04");
		sampleObject.appendField("phone", "655656565");
		sampleObject.appendField("dni", "54545454N");
		sampleObject.appendField("iban", "ES343434343434343433");

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollmentDate", "2012-06-04");
		car_data.appendField("carPlate", "4020 GTE");
		car_data.appendField("model", "Ford");
		car_data.appendField("color", "Blanco");
		sampleObject.appendField("carData", car_data);

		// hacemos el post
		ResultActions result = mockMvc
				.perform(post("/user/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos los datos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	public void testUpdateProfilePhoto() throws Exception {
		// Obtenemos el rol de usuario
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("profilePhoto", "https://fotos.es/photo1.png");

		// hacemos el post
		ResultActions result = mockMvc.perform(post("/user/update/profile-photo").header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
				.accept(MediaType.APPLICATION_JSON));
		// comprobamos los datos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	// NEGATIVO Lanza error
	@Test
	public void testUpdateProfilePhotoError() throws Exception {
		// Obtenemos el rol de usuario
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenThrow(new RuntimeException());

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("profilePhoto", "https://fotos.es/photo1.png");

		// hacemos el post
		ResultActions result = mockMvc.perform(post("/user/update/profile-photo").header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON).content(sampleObject.toJSONString())
				.accept(MediaType.APPLICATION_JSON));
		// comprobamos los datos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	public void testUpdateDataNoAuth() throws Exception {
		// creamos el Json
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("firstName", "Martín");
		sampleObject.appendField("lastName", "Romero");
		sampleObject.appendField("email", "client1@gotacar.es");
		sampleObject.appendField("profilePhoto", "http://dniclient.com");
		sampleObject.appendField("birthdate", "2000-06-04T13:30:00.000+00");

		// hacemos el post
		ResultActions result = mockMvc.perform(post("/user/update").contentType(MediaType.APPLICATION_JSON)
				.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));
		// comprobamos los datos
		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	void testConvertToDriver() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollment_date", "2012-06-04");
		car_data.appendField("car_plate", "4041 ATO");
		car_data.appendField("model", "Opel");
		car_data.appendField("color", "azul marino");
		// Construcción del json para el body
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("id", user.getId());
		sampleObject.appendField("iban", "ES2121001859436727673434");
		sampleObject.appendField("driving_license",
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Floentiendo.com%2Frenovar-carnet-de-conducir%2Fcomment-page-4%2F&psig=AOvVaw3QB9z2DMG22U7ygu_nOW0o&ust=1618134528516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKj5w4Cz8-8CFQAAAAAdAAAAABAD");
		sampleObject.appendField("experience", 9);
		sampleObject.appendField("car_data", car_data);

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(user.getDriverStatus()).isEqualTo("PENDING");
	}

	@Test
	void testConvertToDriverFailed() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollment_date", "2012-06-04");
		car_data.appendField("car_plate", "4041 ATO");
		car_data.appendField("model", "Opel");
		car_data.appendField("color", "azul marino");
		// Construcción del json para el body
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("id", user.getId());
		sampleObject.appendField("iban", "ES2121001859436727673434");
		sampleObject.appendField("driving_license",
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Floentiendo.com%2Frenovar-carnet-de-conducir%2Fcomment-page-4%2F&psig=AOvVaw3QB9z2DMG22U7ygu_nOW0o&ust=1618134528516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKj5w4Cz8-8CFQAAAAAdAAAAABAD");
		sampleObject.appendField("experience", 9);
		sampleObject.appendField("car_data", car_data);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	void testConvertToDriverBanned() throws Exception {
		user.setBannedUntil(LocalDateTime.of(2021, 10, 10, 13, 30, 00));
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);

		JSONObject car_data = new JSONObject();
		car_data.appendField("enrollment_date", "2012-06-04");
		car_data.appendField("car_plate", "4041 ATO");
		car_data.appendField("model", "Opel");
		car_data.appendField("color", "azul marino");
		// Construcción del json para el body
		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("id", user.getId());
		sampleObject.appendField("iban", "ES2121001859436727673434");
		sampleObject.appendField("driving_license",
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Floentiendo.com%2Frenovar-carnet-de-conducir%2Fcomment-page-4%2F&psig=AOvVaw3QB9z2DMG22U7ygu_nOW0o&ust=1618134528516000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKj5w4Cz8-8CFQAAAAAdAAAAABAD");
		sampleObject.appendField("experience", 9);
		sampleObject.appendField("car_data", car_data);

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/create").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(409);
		assertThat(result.andReturn().getResponse().getErrorMessage())
				.isEqualTo("Ahora mismo su cuenta se encuentra baneada");
	}

	@Test
	void testAcceptRequestToDriver() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(user.getDriverStatus()).isEqualTo("ACCEPTED");
	}

	// NEGATIVO Update info de driver
	@Test
	void testAcceptRequestToDriverError() throws Exception {
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByUid(user.getUid())).thenThrow(new RuntimeException());

		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	void testAcceptRequestToDriverFailed() throws Exception {
		Mockito.when(userRepository.findByUid(user.getUid())).thenReturn(user);

		JSONObject sampleObject = new JSONObject();
		sampleObject.appendField("uid", user.getUid());

		String response = mockMvc.perform(post("/user").param("uid", user.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);

		String token = json2.getString("token");

		ResultActions result = mockMvc
				.perform(post("/driver/update").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
						.content(sampleObject.toJSONString()).accept(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	void testFindAllPending() throws Exception {
		user.setDriverStatus("PENDING");
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByDriverStatus("PENDING")).thenReturn(java.util.Arrays.asList(user));

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/driver-request/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);

		String res = result.andReturn().getResponse().getContentAsString();
		int contador = 0;
		while (res.contains("driverStatus")) {
			res = res.substring(res.indexOf("driverStatus") + "driverStatus".length(), res.length());
			contador++;
		}
		assertThat(contador).isEqualTo(1);
	}
	
	//NEGATIVO Lanza error
	@Test
	void testFindAllPendingError() throws Exception {
		user.setDriverStatus("PENDING");
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findByDriverStatus("PENDING")).thenThrow(new RuntimeException());

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/driver-request/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);

	}

	@Test
	void testFindAllPendingFail() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByDriverStatus("PENDING")).thenReturn(java.util.Arrays.asList(user));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				get("/driver-request/list").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(403);
	}

	@Test
	@WithMockUser(value = "spring")
	void testFindUsersByTrip() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenReturn(trip);

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		String tripId = trip.getId();

		ResultActions result = mockMvc.perform(get("/list_users_trip/{tripId}", tripId).header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(result.andReturn().getResponse().getErrorMessage()).isNull();
	}
	//Negativo lanza error
	@Test
	@WithMockUser(value = "spring")
	void testFindUsersByTripError() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(tripRepository.findById(new ObjectId(trip.getId()))).thenThrow(new RuntimeException());

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();
		org.json.JSONObject json2 = new org.json.JSONObject(response);
		// Obtengo el token
		String token = json2.getString("token");
		String tripId = trip.getId();

		ResultActions result = mockMvc.perform(get("/list_users_trip/{tripId}", tripId).header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}
	
	@Test
	void deleteAccountWithTripAndTripOrder() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(tripRepository.findByDriverAndCanceled(driver, false)).thenReturn(java.util.Arrays.asList(trip1));
		Mockito.when(tripOrderRepository.findByUserAndStatus(driver, "PROCCESSING"))
				.thenReturn(java.util.Arrays.asList(tripOrder2));

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				post("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}
	
	@Test
	void deleteAccountWithTripAndTripOrderPendingTrips() throws Exception {
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);
		Mockito.when(userRepository.findByEmail(driver.getEmail())).thenReturn(driver);
		Mockito.when(tripRepository.findByDriverAndCanceled(driver, false)).thenReturn(java.util.Arrays.asList());
		Mockito.when(tripOrderRepository.findByUserAndStatus(driver, "PROCCESSING"))
				.thenReturn(java.util.Arrays.asList());

		String response = mockMvc.perform(post("/user").param("uid", driver.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				post("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
	}

	@Test
	void deleteAccountWithTrip() throws Exception {
		Mockito.when(userRepository.findByUid(driver2.getUid())).thenReturn(driver2);
		Mockito.when(userRepository.findByEmail(driver2.getEmail())).thenReturn(driver2);
		Mockito.when(tripRepository.findByDriverAndCanceled(driver2, false)).thenReturn(java.util.Arrays.asList(trip2));
		Mockito.when(tripOrderRepository.findByUserAndStatus(driver2, "PROCCESSING"))
				.thenReturn(new ArrayList<TripOrder>());

		String response = mockMvc.perform(post("/user").param("uid", driver2.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				post("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	void deleteAccountWithTripOrder() throws Exception {
		Mockito.when(userRepository.findByUid(user1.getUid())).thenReturn(user1);
		Mockito.when(userRepository.findByEmail(user1.getEmail())).thenReturn(user1);
		Mockito.when(tripRepository.findByDriverAndCanceled(user1, false)).thenReturn(new ArrayList<Trip>());
		Mockito.when(tripOrderRepository.findByUserAndStatus(user1, "PROCCESSING"))
				.thenReturn(java.util.Arrays.asList(tripOrder1));

		String response = mockMvc.perform(post("/user").param("uid", user1.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json = new org.json.JSONObject(response);
		String token = json.getString("token");

		ResultActions result = mockMvc.perform(
				post("/delete-account").header("Authorization", token).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	@Test
	@WithMockUser(value = "spring")
	void testDeletePenalizedAccount() throws Exception {
		user.setTimesBanned(4);
		Mockito.when(userRepository.findByUid(admin.getUid())).thenReturn(admin);
		Mockito.when(userRepository.findById(new ObjectId(user.getId()))).thenReturn(user);
		Mockito.when(tripRepository.findByDriverAndCanceled(user, false)).thenReturn(new ArrayList<>());
		Mockito.when(tripOrderRepository.findByUserAndStatus(user, "PROCCESSING"))
				.thenReturn(new ArrayList<TripOrder>());
		;

		String response = mockMvc.perform(post("/user").param("uid", admin.getUid())).andReturn().getResponse()
				.getContentAsString();

		org.json.JSONObject json2 = new org.json.JSONObject(response);
		String token = json2.getString("token");

		ResultActions result = mockMvc.perform(post("/delete-penalized-account").header("Authorization", token)
				.contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(404);
	}

	// TEst positivo ciando el usuario no esta baneado
	@Test
	void testLoginBannedNull() throws Exception {
		driver.setBannedUntil(null);
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);

		ResultActions result = mockMvc
				.perform(post("/user").param("uid", driver.getUid()).contentType(MediaType.APPLICATION_JSON));
		String response = result.andReturn().getResponse().getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String dateS = json.getString("bannedUntil");

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(dateS).isEqualTo("null");
	}

	// NEGATIVO entra en el catch
	@Test
	void testLoginError() throws Exception {
		driver.setBannedUntil(null);
		Mockito.when(userRepository.findByUid(driver.getUid())).thenThrow(new RuntimeException());

		ResultActions result = mockMvc
				.perform(post("/user").param("uid", driver.getUid()).contentType(MediaType.APPLICATION_JSON));

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(400);
	}

	// Test positivo cuando el ususario esta baneado con una fecha posterior a la
	// actual
	@Test
	void testLoginBannedFuture() throws Exception {
		driver.setBannedUntil(LocalDateTime.of(2030, 05, 24, 16, 15, 00));
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);

		ResultActions result = mockMvc
				.perform(post("/user").param("uid", driver.getUid()).contentType(MediaType.APPLICATION_JSON));
		String response = result.andReturn().getResponse().getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String dateS = json.getString("bannedUntil");
		LocalDateTime date = LocalDateTime.parse(dateS);

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(date).isEqualTo(driver.getBannedUntil());
	}

	// Test positivo cuando el ususario esta baneado con una fecha antigua
	@Test
	void testLoginBannedPast() throws Exception {
		driver.setBannedUntil(LocalDateTime.of(2000, 05, 24, 16, 15, 00));
		Mockito.when(userRepository.findByUid(driver.getUid())).thenReturn(driver);

		ResultActions result = mockMvc
				.perform(post("/user").param("uid", driver.getUid()).contentType(MediaType.APPLICATION_JSON));
		String response = result.andReturn().getResponse().getContentAsString();
		org.json.JSONObject json = new org.json.JSONObject(response);
		String dateS = json.getString("bannedUntil");

		assertThat(result.andReturn().getResponse().getStatus()).isEqualTo(200);
		assertThat(dateS).isEqualTo("null");
	}
}
