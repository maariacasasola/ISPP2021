package com.gotacar.backend.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.gotacar.backend.models.rating.Rating;
import com.gotacar.backend.models.trip.Trip;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import static org.assertj.core.api.Assertions.assertThat;

class RatingTests {
    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private final Validator validator = createValidator();

    private static User client;
    private static User driver;
    private static Trip trip;

    @BeforeAll
    private static void setData() {
        List<String> authorities = new ArrayList<String>();
        authorities.add("ROLE_CLIENT");
        LocalDate birthdate1 = LocalDate.of(1999, 10, 10);
        client = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com",
                birthdate1, authorities, "655757575");

        List<String> authoritiesDriver = new ArrayList<String>();
        authorities.add("ROLE_CLIENT");
        authorities.add("ROLE_DRIVER");
        LocalDate birthdate2 = LocalDate.of(1999, 10, 10);
        driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es", "89070310K",
                "http://dnidriver.com", birthdate2, authoritiesDriver, "655757575");
        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917,
                -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla",
                37.38919329738635, -5.999724275498323); 
        LocalDateTime fecha6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime fecha7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        trip = new Trip(location1, location3, 220, fecha6, fecha7,
                "Viaje desde Cerro del Águila hasta Triana", 3, driver);
    }

    @Test
    void ratingCreateSuccess() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Mala conducción", 1, trip);

        assertThat(rating.getCreatedAt()).isNotNull();
    }

    @Test
    void userFromCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(null, driver, "Buena compañía", 4,trip);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void userToCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, null, "Mala conducción", 2,trip);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void contentCantBeBlank() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "", 3,trip);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    void pointsMinTest() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Mala conducción", -3,trip);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be greater than or equal to 1");
    }

    @Test
    void pointsMaxTest() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Buena conducción", 6,trip);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be less than or equal to 5");
    }

    @Test
    void tripToCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Mala conducción", 2,null);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

}
