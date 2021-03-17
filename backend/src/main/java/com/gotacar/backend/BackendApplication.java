package com.gotacar.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

import com.gotacar.backend.models.MeetingPoint;
import com.gotacar.backend.models.MeetingPointRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MeetingPointRepository meetingPointRepository;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		userRepository.deleteAll();
		meetingPointRepository.deleteAll();

		// save a couple of customers
		userRepository.save(new User("Alice", "Smith"));
		userRepository.save(new User("Bob", "Smith"));

		//save meeting points
		meetingPointRepository.save(new MeetingPoint(37.37722160408209, -5.9871317313950705, "41013, Plaza de España, Sevilla", "Plaza de España"));
		meetingPointRepository.save(new MeetingPoint(37.42663376216525, -5.978099088991483, "41015, Torneo, Sevilla", "Torneo"));
		meetingPointRepository.save(new MeetingPoint(37.38904108989198, -5.999657242969646, "Calle Reyes Católicos, 5, 41001 Sevilla", "Petit Palace Puerta de Triana"));
		meetingPointRepository.save(new MeetingPoint(37.37625144174958, -5.976345387146261, "Av. de Diego Martínez Barrio, 4, 41013 Sevilla", "Viapol Center"));
	}

}
