package com.gotacar.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

class UserModelTests {

	private Validator createValidator() {
		LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
		localValidatorFactoryBean.afterPropertiesSet();
		return localValidatorFactoryBean;
	}

	private Validator validator = createValidator();

	@Test
	void setWrongUserNif() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "1234568P", "http://hola.com", date,
				lista, "655757575");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("Invalid dni number");

	}

	@Test
	void setWrongUserEmail() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsfadsf.com", "12345678P", "http://hola.com", date,
				lista, "655757575");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("Invalid email");

	}

	@Test
	void setWrongUserBirthdate() {
		LocalDate date = LocalDate.parse("2022-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "12345678P", "http://hola.com", date,
				lista, "655757575");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("Invalid birthdate");

	}

	@Test
	void setWrongUserPhoto() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "12345678P", "unafoto", date, lista,
				"655757575");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("Photo must be an url");

	}

	@Test
	void setEmptyParameters() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("", "", "", "fadsf@adsf.com", "12345678P", "http://hola.com", date, lista, "655757575");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("must not be blank");

	}

	@Test
	void setDriverStatus() {
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "12345678P", "http://hola.com", date,
				lista, null, null, null, null, null, null, null);
		user1.setDriverStatus("edqwdq");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage())
				.isEqualTo("El estado de la validación del conductar solo puede ser: (PENDING|ACCEPTED|CANCELLED)");

	}

	@Test
	void setDrivingLicense() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "12345678P", "http://hola.com", date,
				lista, null, null, null, null, null, null, null);
		user1.setDrivingLicense("f23r3");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("Driving license must be an url");

	}

	@Test
	void setIban() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "12345678P", "http://hola.com", date,
				lista, null, null, null, null, null, null, null);
		user1.setIban("ES0690000001210123456789");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		assertThat(constraintViolations).isEmpty();
	}

	@Test
	void setIbanFailed() {
		LocaleContextHolder.setLocale(Locale.ENGLISH);
		LocalDate date = LocalDate.parse("1999-01-08");
		List<String> lista = new ArrayList<>();
		lista.add("ROLE_CLIENT");
		User user1 = new User("Fernando", "Angulo", "5678ghjkl", "fadsf@adsf.com", "12345678P", "http://hola.com", date,
				lista, null, null, null, null, null, null, null);
		user1.setIban("f23r3");

		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user1);

		ConstraintViolation<User> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage())
				.isEqualTo("Iban incorrecto, debe seguir el formato ES1111111111111111111111");
	}

}
