package com.gotacar.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.MeetingPoint;
import com.gotacar.backend.models.MeetingPointRepository;
import com.gotacar.backend.models.Trip;
import com.gotacar.backend.models.TripRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MeetingPointRepository meetingPointRepository;

	@Autowired
	private TripRepository tripRepository;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		loadSampleDate();
	}

	private void loadSampleDate() {

		userRepository.deleteAll();
		meetingPointRepository.deleteAll();
		tripRepository.deleteAll();

		// USERS
		List<String> lista1 = new ArrayList<String>();
		lista1.add("ROLE_ADMIN");
		List<String> lista2 = new ArrayList<String>();
		lista2.add("ROLE_CLIENT");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("ROLE_CLIENT");
		lista3.add("ROLE_DRIVER");
		LocalDate fecha1 = LocalDate.of(1999, 10, 10);
		LocalDate fecha2 = LocalDate.of(2000, 11, 20);
		LocalDate fecha3 = LocalDate.of(2001, 12, 30);
		User user1 = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com",
				fecha1, lista1);
		User user2 = new User("Paloma", "Perez", "2", "palomino69@gmail.com", "421312", "http://dewfewfewf.com", fecha2,
				lista2);
		User user3 = new User("Elba", "Calao", "3", "congitodechocolate@gmail.com", "890703", "http://huiogr.com",
				fecha3, lista3);
		userRepository.save(user1);
		userRepository.save(user2);
		userRepository.save(user3);

		// TRIPS
		Location location1 = new Location("Sevilla", "Calle Canal 48", 37.3747084, -5.9649715);
		Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958, -5.976345387146261);
		Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635, -5.999724275498323);
		Location location4 = new Location("Torneo", "41015, Torneo, Sevilla", 37.397905288097164, -6.000865415980872);

		LocalDateTime fecha4 = LocalDateTime.of(2021, 06, 04, 13, 30, 24);
		LocalDateTime fecha5 = LocalDateTime.of(2021, 06, 04, 13, 36, 24);
		LocalDateTime fecha6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
		LocalDateTime fecha7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);

		Trip trip1 = new Trip(location1, location2, 220, fecha6, fecha7, "Cometario", 3, user1);
		Trip trip2 = new Trip(location2, location1, 220, fecha6, fecha7, "Cometario", 3, user1);
		Trip trip3 = new Trip(location3, location4, 40, fecha4, fecha5, "Cometario", 2, user1);
		Trip trip4 = new Trip(location3, location4, 50, fecha4, fecha5, "Cometario", 3, user1);

		tripRepository.save(trip1);
		tripRepository.save(trip2);
		tripRepository.save(trip3);
		tripRepository.save(trip4);

		// MEETING POINTS
		meetingPointRepository.save(new MeetingPoint(37.37722160408209, -5.9871317313950705,
				"41013, Plaza de España, Sevilla", "Plaza de España"));
		meetingPointRepository
				.save(new MeetingPoint(37.42663376216525, -5.978099088991483, "41015, Torneo, Sevilla", "Torneo"));
		meetingPointRepository.save(new MeetingPoint(37.38919329738635, -5.999724275498323,
				"Calle Reyes Católicos, 5, 41001 Sevilla", "Petit Palace Puerta de Triana"));
		meetingPointRepository.save(new MeetingPoint(37.37625144174958, -5.976345387146261,
				"Av. de Diego Martínez Barrio, 4, 41013 Sevilla", "Viapol Center"));

		Long users = userRepository.count();
		Long meetingPoints = meetingPointRepository.count();
		Long trips = tripRepository.count();
		System.out.println(users + " usuarios creados");
		System.out.println(meetingPoints + " puntos de encuentro creados");
		System.out.println(trips + " viajes creados");

	}

	@EnableWebSecurity
	@Configuration
	@EnableGlobalMethodSecurity(prePostEnabled = true)
	class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable()
					.addFilterAfter(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
					.authorizeRequests().antMatchers(HttpMethod.POST, "/user").permitAll()
					.antMatchers(HttpMethod.POST, "/search_trips").permitAll().anyRequest().authenticated();
		}
	}

}
