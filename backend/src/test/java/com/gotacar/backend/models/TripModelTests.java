package com.gotacar.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.Validator;

import com.gotacar.backend.models.Trip.Trip;

import javax.validation.ConstraintViolation;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

public class TripModelTests {
    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private Validator validator = createValidator();

    private static User user;

    @BeforeAll
    private static void setData() {
        List<String> authorities = new ArrayList<String>();
        authorities.add("client");
        authorities.add("driver");
        LocalDate fecha = LocalDate.of(1999, 10, 10);
        user = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com", fecha,
                authorities);
    }

    @Test
    public void setMaxDirectionLength() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Bami", "Calle Teba 1", 2.333, -2.111);
        Location location2 = new Location("Lipa", "Calle Teba 1", 2.333, -2.111);

		LocalDateTime date = LocalDateTime.of(2021, 06, 04, 13, 30, 24);

        Trip trip1 = new Trip(location1, location2, 500, date, date, "Cometario", 3, user);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip1);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be less than or equal to 400");
    }
}
