package com.gotacar.backend.models;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.Validator;

import com.gotacar.backend.models.trip.Trip;

import javax.validation.ConstraintViolation;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

class TripModelTests {
    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private Validator validator = createValidator();

    private static User driver;

    @BeforeAll
    private static void setData() {
        List<String> authoritiesDriver = new ArrayList<String>();
        authoritiesDriver.add("ROLE_CLIENT");
        authoritiesDriver.add("ROLE_DRIVER");
        LocalDate birthdate2 = LocalDate.of(1999, 10, 10);
        driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es", "89070310K",
                "http://dnidriver.com", birthdate2, authoritiesDriver, "655757575");
    }

    @Test
    void contentCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, null, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void startDateCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, 220, date7, date7, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);
        trip.setStartDate(null);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void startDateCantBePast() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 03, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, 220, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be a future date");
    }

    @Test
    void endDateCantBePast() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 03, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, 220, date7, date6, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be a future date");
    }

    @Test
    void contentCantBeBlank() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, 220, date6, date7, "", 3, driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    void placesCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, 220, date6, date7, "Viaje desde Cerro del Águila hasta Triana", null,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void placesMustBeLowerThan() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, 220, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 5,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be less than or equal to 4");
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 20, 200})
    void priceWithPositiveValues(Integer price) {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, price, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        assertThat(constraintViolations.isEmpty());
    }

    @ParameterizedTest
    @ValueSource(ints = {-200,-20, -1 , 0})
    void priceWithNegativeValues(Integer price) {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        Trip trip = new Trip(location1, location3, price, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);

        Set<ConstraintViolation<Trip>> constraintViolations = validator.validate(trip);

        ConstraintViolation<Trip> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be greater than or equal to 1");
    }
}
