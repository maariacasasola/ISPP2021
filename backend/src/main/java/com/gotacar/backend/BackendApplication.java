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
import java.util.ArrayList;
import java.util.List;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		userRepository.deleteAll();
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
		// save a couple of customers
		userRepository.save(user1);
		userRepository.save(user2);
		userRepository.save(user3);

		// fetch all customers
		System.out.println("Customers found with findAll():");
		System.out.println("-------------------------------");
		for (User customer : userRepository.findAll()) {
			System.out.println(customer);
		}
		System.out.println();

		// fetch an individual customer
		System.out.println("Customer found with findByFirstName('Manuel'):");
		System.out.println("--------------------------------");
		System.out.println(userRepository.findByFirstName("Manuel"));

		System.out.println("Customers found with findByLastName('Smith'):");
		System.out.println("--------------------------------");
		for (User customer : userRepository.findByLastName("Smith")) {
			System.out.println(customer);
		}

	}

	@EnableWebSecurity
	@Configuration
	@EnableGlobalMethodSecurity(prePostEnabled = true)
	class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable()
					.addFilterAfter(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
					.authorizeRequests().antMatchers(HttpMethod.POST, "/user").permitAll().anyRequest().authenticated();
		}
	}

}
