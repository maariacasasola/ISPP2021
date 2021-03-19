package com.gotacar.backend;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.gotacar.backend.models.User;

import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.assertj.core.api.Assertions.assertThat;

public class UserModelTests {

	private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }
	
	private Validator validator = createValidator();
    
	
	@Test
	public void setWrongUserNif() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_ADMIN");
		User user1 = new User("Fernando","Angulo","5678ghjkl", "fadsf@adsf.com", "1234568P","http://hola.com", date, lista);
	
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);
		
		ConstraintViolation<User> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("Invalid dni number");
		
	}
	
	@Test
	public void setWrongUserEmail() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_ADMIN");
		User user1 = new User("Fernando","Angulo","5678ghjkl", "fadsfadsf.com", "12345678P","http://hola.com", date, lista);
	
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);
		
		ConstraintViolation<User> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("Invalid email");
		
	}
	
	@Test
	public void setWrongUserBirthdate() {
		LocalDate date = LocalDate.parse("2022-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_ADMIN");
		User user1 = new User("Fernando","Angulo","5678ghjkl", "fadsf@adsf.com", "12345678P","http://hola.com", date, lista);
	
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);
		
		ConstraintViolation<User> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("Invalid birthdate");
		
	}
	
	@Test
	public void setWrongUserPhoto() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_ADMIN");
		User user1 = new User("Fernando","Angulo","5678ghjkl", "fadsf@adsf.com", "12345678P","unafoto", date, lista);
	
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);
		
		ConstraintViolation<User> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("Photo must be an url");
		
	}
	
	@Test
	public void setNullParameters() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_ADMIN");
		User user1 = new User(null,null,null,"fadsf@adsf.com", "12345678P","http://hola.com", date, lista);
	
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);
		
		ConstraintViolation<User> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
		
	}
	@Test
	public void setEmptyParameters() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_ADMIN");
		User user1 = new User("","","","fadsf@adsf.com", "12345678P","http://hola.com", date, lista);
	
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);
		
		ConstraintViolation<User> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
		
	}
}
