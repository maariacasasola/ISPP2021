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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;
import com.gotacar.backend.models.Complaint;
import com.gotacar.backend.models.ComplaintAppeal;
import com.gotacar.backend.models.ComplaintAppealRepository;
import com.gotacar.backend.models.ComplaintRepository;
import com.gotacar.backend.models.Location;
import com.gotacar.backend.models.MeetingPoint;
import com.gotacar.backend.models.MeetingPointRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private MeetingPointRepository meetingPointRepository;

        @Autowired
        private TripRepository tripRepository;

        @Autowired
        private TripOrderRepository tripOrderRepository;

        @Autowired
        private ComplaintAppealRepository complaintAppealRepository;

        @Autowired
        private ComplaintRepository complaintRepository;

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
                tripOrderRepository.deleteAll();
                complaintRepository.deleteAll();
                complaintAppealRepository.deleteAll();

                // USERS
                // -----------------------------------------------------------------------------------------
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

                // Admin
                User admin = new User("Antonio", "Fernández", "Ej7NpmWydRWMIg28mIypzsI4BgM2", "admin@gotacar.es",
                                "89070360G", "http://dniadmin.com", fecha3, lista1);

                userRepository.save(admin);

                // Drivers
                User driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es",
                                "89070310K", null, fecha3, lista3);
                User driver2 = new User("Manuel", "Fernández", "h9HmVQqlBQXD289O8t8q7aN2Gzg2", "driver2@gmail.com",
                                "312312312R", null, fecha1, lista3, LocalDateTime.of(2021, 06, 04, 13, 30, 24));
                User driver3 = new User("Marina", "Chacón", "h9HmVQqlBQXD289O8t8q7aN2Gzg3", "driver3@gmail.com",
                                "312412412J", null, fecha1, lista3);

                userRepository.save(driver);
                userRepository.save(driver2);
                userRepository.save(driver3);

                // Clients
                User client = new User("Martín", "Romero", "gHiQxzWlXleUoEdQLmosPMlSk8f2", "client@gotacar.es",
                                "89070336D", "http://dniclient.com", fecha3, lista2);
                User client2 = new User("Paloma", "Pérez", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE2", "client2@gotacar.com",
                                "42131220T", "http://dniclient.com", fecha2, lista2);
                User client3 = new User("Blanca", "Ruíz", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE3", "client3@gotacar.es",
                                "89070345D", "http://dniclient.com", fecha1, lista2);
                User client4 = new User("Alberto", "Suárez", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE4", "client4@gotacar.com",
                                "42131225F", "http://dniclient.com", fecha2, lista2);
                User client5 = new User("Salvador", "Luque", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE5", "client5@gotacar.es",
                                "89070678S", "http://dniclient.com", fecha3, lista2);
                User client6 = new User("María", "Sánchez", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE6", "client6@gotacar.com",
                                "35131220T", "http://dniclient.com", fecha1, lista2);
                User client7 = new User("Laura", "Muñoz", "qG6h1Pc4DLbPTTTKmXdSxIMEUUE7", "clien7@gotacar.es",
                                "80270336K", "http://dniclient.com", fecha3, lista2);
                User client8 = new User("Pedro", "Serrano", "oQfGQi4xechNkcQEdHg29sM5rP33", "client8@gotacar.com",
                                "42941220L", "http://dniclient.com", fecha2, lista2);

                userRepository.save(client);
                userRepository.save(client2);
                userRepository.save(client3);
                userRepository.save(client4);
                userRepository.save(client5);
                userRepository.save(client6);
                userRepository.save(client7);
                userRepository.save(client8);

                // MEETING POINTS
                // -----------------------------------------------------------------------------------------
                MeetingPoint meetingPoint1 = new MeetingPoint(37.37722160408209, -5.9871317313950705,
                                "41013, Plaza de España, Sevilla", "Plaza de España");
                MeetingPoint meetingPoint2 = new MeetingPoint(37.42663376216525, -5.978099088991483,
                                "41015, Torneo, Sevilla", "Torneo");
                MeetingPoint meetingPoint3 = new MeetingPoint(37.38919329738635, -5.999724275498323,
                                "Calle Reyes Católicos, 5, 41001 Sevilla", "Puerta de Triana");
                MeetingPoint meetingPoint4 = new MeetingPoint(37.37625144174958, -5.976345387146261,
                                "Av. de Diego Martínez Barrio, 4, 41013 Sevilla", "Viapol Center");
                MeetingPoint meetingPoint5 = new MeetingPoint(37.355909980568825, -5.9799303283997,
                                "Av. de la Palmera, 41013 Sevilla", "Heliópolis");
                MeetingPoint meetingPoint6 = new MeetingPoint(37.42556002644737, -5.972137193244373,
                                "Norte, 41015 Sevilla", "Pino Montano");

                meetingPointRepository.save(meetingPoint1);
                meetingPointRepository.save(meetingPoint2);
                meetingPointRepository.save(meetingPoint3);
                meetingPointRepository.save(meetingPoint4);
                meetingPointRepository.save(meetingPoint5);
                meetingPointRepository.save(meetingPoint6);

                // TRIPS
                // -----------------------------------------------------------------------------------------
                Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917,
                                -5.96211306033204);
                Location location2 = new Location("Viapol", "Av. Diego Martínez Barrio", 37.37625144174958,
                                -5.976345387146261);
                Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla",
                                37.38919329738635, -5.999724275498323);
                Location location4 = new Location("Torneo", "41015, Torneo, Sevilla", 37.397905288097164,
                                -6.000865415980872);
                Location location5 = new Location("Heliópolis", "Av. de la Palmera, 41013 Sevilla", 37.355909980568825,
                                -5.9799303283997);
                Location location6 = new Location("Reina Mercedes", "Av. Reina Mercedes, Facultad de Informática",
                                37.35832075681644, -5.986327861966737);
                Location location7 = new Location("Puerta Jerez", "Paseo de Roma, 33, 41013 Sevilla", 37.38094298983268,
                                -5.9938026174584484);
                Location location8 = new Location("Lagoh", "Av. de Palmas Altas, 1, 41012 Sevilla", 37.34260576245235,
                                -5.987332644990308);

                LocalDateTime fecha4 = LocalDateTime.of(2021, 06, 04, 13, 30, 24);
                LocalDateTime fecha5 = LocalDateTime.of(2021, 06, 04, 13, 36, 24);
                LocalDateTime fecha6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
                LocalDateTime fecha7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
                LocalDateTime fecha8 = LocalDateTime.of(2021, 03, 20, 17, 00, 00);
                LocalDateTime fecha9 = LocalDateTime.of(2021, 03, 20, 17, 21, 00);
                LocalDateTime fecha10 = LocalDateTime.of(2021, 03, 21, 12, 00, 00);
                LocalDateTime fecha11 = LocalDateTime.of(2021, 03, 21, 12, 40, 00);

                Trip trip1 = new Trip(location1, location3, 220, fecha6, fecha7,
                                "Viaje desde Cerro del Águila hasta Triana", 3, driver);
                Trip trip2 = new Trip(location2, location5, 220, fecha6, fecha7, "Viaje desde Viapol hasta Heliópolis",
                                3, driver2);
                Trip trip3 = new Trip(location1, location6, 200, fecha6, fecha7,
                                "Viaje desde Cerro del Águila hasta Reina Mercedes", 2, driver3);
                Trip trip4 = new Trip(location3, location4, 300, fecha4, fecha5, "Viaje desde Triana hasta Torneo", 3,
                                driver3);
                Trip trip5 = new Trip(location3, location4, 250, fecha4, fecha5, "Viaje desde Triana hasta Torneo", 2,
                                driver2);
                Trip trip6 = new Trip(location7, location8, 350, fecha8, fecha9, "Viaje desde Puerta Jerez hasta Lagoh",
                                2, driver);
                Trip trip7 = new Trip(location6, location4, 400, fecha8, fecha9,
                                "Viaje desde Reina Mercedes hasta Torneo", 2, driver2);
                Trip trip8 = new Trip(location4, location8, 450, fecha10, fecha11, "Viaje desde Torneo hasta Lagoh", 3,
                                driver);
                Trip trip9 = new Trip(location4, location8, 450, fecha10, fecha11, "Viaje desde Torneo hasta Lagoh", 3,
                                driver);
                Trip trip10 = new Trip(location4, location8, 450, fecha10, fecha11, "Viaje desde Torneo hasta Lagoh", 3,
                                driver);

                tripRepository.save(trip1);
                tripRepository.save(trip2);
                tripRepository.save(trip3);
                tripRepository.save(trip4);
                tripRepository.save(trip5);
                tripRepository.save(trip6);
                tripRepository.save(trip7);
                tripRepository.save(trip8);
                tripRepository.save(trip9);
                tripRepository.save(trip10);

                // TRIP ORDERS
                // -----------------------------------------------------------------------------------------
                TripOrder tripOrder1 = new TripOrder(trip6, client, LocalDateTime.of(2021, 03, 20, 11, 45, 00), 350, "",
                                1);
                TripOrder tripOrder2 = new TripOrder(trip6, client2, LocalDateTime.of(2021, 03, 20, 11, 40, 00), 700,
                                "", 2);
                TripOrder tripOrder3 = new TripOrder(trip7, client3, LocalDateTime.of(2021, 03, 20, 14, 46, 37), 400,
                                "", 1);
                TripOrder tripOrder4 = new TripOrder(trip7, client5, LocalDateTime.of(2021, 03, 20, 15, 29, 25), 400,
                                "", 1);
                TripOrder tripOrder5 = new TripOrder(trip8, client4, LocalDateTime.of(2021, 03, 21, 10, 57, 42), 450,
                                "", 1);
                TripOrder tripOrder6 = new TripOrder(trip8, client7, LocalDateTime.of(2021, 03, 21, 11, 17, 28), 900,
                                "", 2);
                TripOrder tripOrder7 = new TripOrder(trip6, client6, LocalDateTime.of(2021, 03, 20, 16, 57, 42), 350,
                                "", 1);
                TripOrder tripOrder8 = new TripOrder(trip6, client8, LocalDateTime.of(2021, 03, 20, 11, 37, 16), 350,
                                "", 1);
                TripOrder tripOrder9 = new TripOrder(trip8, client3, LocalDateTime.of(2021, 03, 21, 11, 50, 52), 450,
                                "", 1);
                TripOrder tripOrder10 = new TripOrder(trip1, client5, LocalDateTime.of(2021, 03, 24, 11, 30, 22), 440,
                                "", 2);
                TripOrder tripOrder11 = new TripOrder(trip2, client8, LocalDateTime.of(2021, 03, 24, 20, 33, 27), 220,
                                "", 1);
                TripOrder tripOrder12 = new TripOrder(trip3, client, LocalDateTime.of(2021, 03, 24, 17, 35, 22), 400,
                                "", 2);
                TripOrder tripOrder13 = new TripOrder(trip2, client7, LocalDateTime.of(2021, 03, 24, 22, 50, 03), 220,
                                "", 1);
                TripOrder tripOrder14 = new TripOrder(trip4, driver, LocalDateTime.of(2021, 03, 24, 23, 46, 32), 300,
                                "", 1);
                TripOrder tripOrder15 = new TripOrder(trip5, client2, LocalDateTime.of(2021, 03, 24, 11, 30, 22), 500,
                                "", 2);
                TripOrder tripOrder16 = new TripOrder(trip9, client, LocalDateTime.of(2021, 03, 24, 11, 30, 22), 500,
                                "", 2);
                TripOrder tripOrder17 = new TripOrder(trip10, client, LocalDateTime.of(2021, 03, 24, 11, 30, 22), 500,
                                "", 2);

                tripOrderRepository.save(tripOrder1);
                tripOrderRepository.save(tripOrder2);
                tripOrderRepository.save(tripOrder3);
                tripOrderRepository.save(tripOrder4);
                tripOrderRepository.save(tripOrder1);
                tripOrderRepository.save(tripOrder5);
                tripOrderRepository.save(tripOrder6);
                tripOrderRepository.save(tripOrder7);
                tripOrderRepository.save(tripOrder8);
                tripOrderRepository.save(tripOrder9);
                tripOrderRepository.save(tripOrder10);
                tripOrderRepository.save(tripOrder11);
                tripOrderRepository.save(tripOrder12);
                tripOrderRepository.save(tripOrder13);
                tripOrderRepository.save(tripOrder14);
                tripOrderRepository.save(tripOrder15);
                tripOrderRepository.save(tripOrder16);
                tripOrderRepository.save(tripOrder17);

                // COMPLAINTS
                // -----------------------------------------------------------------------------------------
                Complaint complaint1 = new Complaint("Queja por velocidad",
                                "El conductor iba demasiado rápido, no me he sentido seguro", trip6, client,
                                LocalDateTime.of(2021, 03, 20, 17, 45, 00));
                Complaint complaint2 = new Complaint("Queja por retraso",
                                "El conductor se ha retrasado 10 min, he llegado tarde a mi destino", trip7, client3,
                                LocalDateTime.of(2021, 03, 20, 18, 00, 04), "ACCEPTED");
                Complaint complaint3 = new Complaint("Queja por mala educación", "El conductor ha sido desagradable",
                                trip7, client5, LocalDateTime.of(2021, 03, 20, 18, 00, 00), "ALREADY_RESOLVED");
                Complaint complaint4 = new Complaint("Queja por retraso", "El conductor se ha retrasado 5 min", trip8,
                                client4, LocalDateTime.of(2021, 03, 21, 12, 30, 00), "REFUSED");
                Complaint complaint5 = new Complaint("Queja por velocidad1",
                                "El conductor iba demasiado rápido, no me he sentido seguro", trip6, client,
                                LocalDateTime.of(2021, 03, 20, 17, 45, 00));
                Complaint complaint6 = new Complaint("Queja por velocidad2",
                                "El conductor iba demasiado rápido, no me he sentido seguro", trip7, client,
                                LocalDateTime.of(2021, 03, 20, 17, 45, 00));
                Complaint complaint7 = new Complaint("Queja por velocidad3",
                                "El conductor iba demasiado rápido, no me he sentido seguro", trip8, client,
                                LocalDateTime.of(2021, 03, 20, 17, 45, 00));

                complaintRepository.save(complaint1);
                complaintRepository.save(complaint2);
                complaintRepository.save(complaint3);
                complaintRepository.save(complaint4);
                complaintRepository.save(complaint5);
                complaintRepository.save(complaint6);
                complaintRepository.save(complaint7);

                // COMPLAINT APPEALS
                // -----------------------------------------------------------------------------------------
                ComplaintAppeal complaintAppeal1 = new ComplaintAppeal(
                                "El retraso fue causado por necesidades personales, suelo ser puntual", false,
                                complaint2);
                ComplaintAppeal complaintAppeal2 = new ComplaintAppeal(
                                "El retraso fue causado por necesidades personales", true, complaint2);
                ComplaintAppeal complaintAppeal3 = new ComplaintAppeal("El retraso fue causado por necesidades", false,
                                complaint3);

                complaintAppealRepository.save(complaintAppeal1);
                complaintAppealRepository.save(complaintAppeal2);
                complaintAppealRepository.save(complaintAppeal3);

                // COMPORBACIÓN
                // -----------------------------------------------------------------------------------------
                Long users = userRepository.count();
                Long meetingPoints = meetingPointRepository.count();
                Long trips = tripRepository.count();
                Long tripOrders = tripOrderRepository.count();
                Long complaints = complaintRepository.count();
                Long complaintAppeals = complaintAppealRepository.count();
                System.out.println(users + " usuarios creados");
                System.out.println(meetingPoints + " puntos de encuentro creados");
                System.out.println(trips + " viajes creados");
                System.out.println(tripOrders + " reservas creadas");
                System.out.println(complaints + " quejas creadas");
                System.out.println(complaintAppeals + " apelaciones creadas");

        }

        @EnableWebSecurity
        @Configuration
        @EnableGlobalMethodSecurity(prePostEnabled = true)
        static class WebSecurityConfig extends WebSecurityConfigurerAdapter implements WebMvcConfigurer {
                @Override
                protected void configure(HttpSecurity http) throws Exception {
                        http.csrf().disable().cors().and()
                                        .addFilterAfter(new JWTAuthorizationFilter(),
                                                        UsernamePasswordAuthenticationFilter.class)
                                        .authorizeRequests().antMatchers(HttpMethod.POST, "/user").permitAll()
                                        .antMatchers(HttpMethod.GET, "/search_meeting_points").permitAll()
                                        .antMatchers(HttpMethod.GET, "/list_trips").permitAll()
                                        .antMatchers(HttpMethod.GET, "/trip/{tripId}").permitAll()
                                        .antMatchers(HttpMethod.POST, "/cancel_trip_driver").permitAll()
                                        .antMatchers(HttpMethod.POST, "/stripe-webhook").permitAll()
                                        .antMatchers(HttpMethod.GET, "/").permitAll()
                                        .antMatchers(HttpMethod.POST, "/search_trips").permitAll().anyRequest()
                                        .authenticated();
                }

                @Override
                public void addCorsMappings(CorsRegistry registry) {
                        registry.addMapping("/**");
                }
        }

}
