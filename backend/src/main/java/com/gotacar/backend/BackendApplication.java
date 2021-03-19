package com.gotacar.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.i18n.LocaleContextHolder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

import java.util.Date;

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

		// save users
		List<String> lista1 = new ArrayList<String>();
		lista1.add("admin");
		List<String> lista2 = new ArrayList<String>();
		lista2.add("client");
		List<String> lista3 = new ArrayList<String>();
		lista3.add("client");
		lista3.add("driver");
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

		// save trips
		Location location1 = new Location("Bami", "Calle Teba 1", 2.333, -2.111);
		Location location2 = new Location("Lipa", "Calle Teba 1", 2.333, -2.111);

		Trip trip1 = new Trip(location1, location2, 220, new Date(), new Date(), "Cometario", 3, user1);
		Trip trip2 = new Trip(location2, location1, 220, new Date(), new Date(), "Cometario", 3, user1);

		tripRepository.save(trip1);
		tripRepository.save(trip2);

		// save meeting points
		meetingPointRepository.save(new MeetingPoint(37.37722160408209, -5.9871317313950705,
				"41013, Plaza de España, Sevilla", "Plaza de España"));
		meetingPointRepository
				.save(new MeetingPoint(37.42663376216525, -5.978099088991483, "41015, Torneo, Sevilla", "Torneo"));
		meetingPointRepository.save(new MeetingPoint(37.38904108989198, -5.999657242969646,
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

}
