package com.gotacar.backend.models;

import com.gotacar.backend.models.Trip.Trip;
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

public class ComplaintTests {
    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private final Validator validator = createValidator();

    private static User client;
    private static Trip trip;
    private static User driver;

    @BeforeAll
    private static void setData() {
        List<String> authorities = new ArrayList<String>();
        authorities.add("ROLE_CLIENT");
        LocalDate birthdate1 = LocalDate.of(1999, 10, 10);
        client = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com", birthdate1,
                authorities);

        List<String> authoritiesDriver = new ArrayList<String>();
        authoritiesDriver.add("ROLE_CLIENT");
        authoritiesDriver.add("ROLE_DRIVER");
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
    public void titleCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        Complaint complaint = new Complaint(null, "No me ha gustado nada", trip, client, date);

        Set<ConstraintViolation<Complaint>> constraintViolations = validator.validate(complaint);

        ConstraintViolation<Complaint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    public void contentCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        Complaint complaint = new Complaint("Viaje horroroso", null, trip, client, date);

        Set<ConstraintViolation<Complaint>> constraintViolations = validator.validate(complaint);

        ConstraintViolation<Complaint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    public void tripCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        Complaint complaint = new Complaint("Viaje horroroso", "Me ha sido imposible estar bien", null, client, date);

        Set<ConstraintViolation<Complaint>> constraintViolations = validator.validate(complaint);

        ConstraintViolation<Complaint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void userCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        Complaint complaint = new Complaint("Viaje horroroso", "Me ha sido imposible estar bien", trip, null, date);

        Set<ConstraintViolation<Complaint>> constraintViolations = validator.validate(complaint);

        ConstraintViolation<Complaint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void statusMatchPattern() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        Complaint complaint = new Complaint("Viaje horroroso", "Me ha sido imposible estar bien", trip, client, date, "AAAA");

        Set<ConstraintViolation<Complaint>> constraintViolations = validator.validate(complaint);

        ConstraintViolation<Complaint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("El estado de la queja solo puede ser: (PENDING|ALREADY_RESOLVED|ACCEPTED|REFUSED)");
    }

}
