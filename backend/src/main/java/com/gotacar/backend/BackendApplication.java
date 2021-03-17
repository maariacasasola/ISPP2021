package com.gotacar.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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

	cargaData();


	}
	
	private void cargaData() {
		userRepository.deleteAll();
		List<String> lista1 = new ArrayList<String>();
		lista1.add("admin");	
		LocalDate fecha1 =  LocalDate.of(2018, 10, 30);	
		User usuario = new User("Manuel","Fernandez","2","manan@gmail.com","312312312","http://dasdasdas.com",fecha1,lista1);
		userRepository.save(usuario);
	}

}
