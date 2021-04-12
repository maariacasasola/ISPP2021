package com.gotacar.backend.models;

import com.gotacar.backend.models.trip.Trip;
import com.gotacar.backend.models.tripOrder.TripOrder;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class TripOrderTests {
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
        client = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com", birthdate1,
                authorities);

        List<String> authoritiesDriver = new ArrayList<String>();
        authorities.add("ROLE_CLIENT");
        authorities.add("ROLE_DRIVER");
        LocalDate birthdate2 = LocalDate.of(1999, 10, 10);
        driver = new User("Jesús", "Márquez", "h9HmVQqlBQXD289O8t8q7aN2Gzg1", "driver@gotacar.es", "89070310K",
                "http://dnidriver.com", birthdate2, authoritiesDriver);

        Location location1 = new Location("Cerro del Águila", "Calle Canal 48", 37.37536809507917, -5.96211306033204);
        Location location3 = new Location("Triana", "Calle Reyes Católicos, 5, 41001 Sevilla", 37.38919329738635,
                -5.999724275498323);
        LocalDateTime date6 = LocalDateTime.of(2021, 05, 24, 16, 00, 00);
        LocalDateTime date7 = LocalDateTime.of(2021, 05, 24, 16, 15, 00);
        trip = new Trip(location1, location3, 220, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 3, driver);
    }

    @Test
    public void userCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(null, client, date, 30, "pay_2312hhhda", 2);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void clientCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, null, date, 30, "pay_2312hhhda", 2);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void dateCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        TripOrder tripOrder1 = new TripOrder(trip, client, null, 30, "pay_2312hhhda", 2);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void priceCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, client, date, null, "pay_2312hhhda", 2);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void paymentIntentCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, client, date, 30, null, 2);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    public void placesCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, client, date, 30, "pay_23asdfasdf", null);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void priceHasMax() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, client, date, 40000, "pay_23asdfasdf", 4);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be less than or equal to 1000");
    }

    @Test
    public void priceHasMin() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, client, date, 1, "pay_23asdfasdf", 4);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be greater than or equal to 10");
    }

    @Test
    public void placesHasMin() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        TripOrder tripOrder1 = new TripOrder(trip, client, date, 100, "pay_23asdfasdf", 0);

        Set<ConstraintViolation<TripOrder>> constraintViolations = validator.validate(tripOrder1);

        ConstraintViolation<TripOrder> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be greater than or equal to 1");
    }
}
