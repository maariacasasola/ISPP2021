package com.gotacar.backend.models;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.gotacar.backend.models.trip.Trip;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

class ComplaintAppealTests {

    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private final Validator validator = createValidator();

    private static User client;
    private static Trip trip;
    private static User driver;
    private static Complaint complaint;

    @BeforeAll
    private static void setData() {
        List<String> authorities = new ArrayList<String>();
        authorities.add("ROLE_CLIENT");
        LocalDate birthdate1 = LocalDate.of(1999, 10, 10);
        client = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com",
                birthdate1, authorities);

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
        trip = new Trip(location1, location3, 220, date6, date7, "Viaje desde Cerro del Águila hasta Triana", 3,
                driver);

        LocalDateTime date = LocalDateTime.of(2021, 6, 4, 13, 30, 24);
        complaint = new Complaint("Queja test", "No me ha gustado nada", trip, client, date);

    }

    @Test
    void contentCantBeBlank() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        ComplaintAppeal complaintAppeal = new ComplaintAppeal("", false, complaint);

        Set<ConstraintViolation<ComplaintAppeal>> constraintViolations = validator.validate(complaintAppeal);

        ConstraintViolation<ComplaintAppeal> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    void contentLength() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        ComplaintAppeal complaintAppeal = new ComplaintAppeal(
                "Y, viéndole don Quijote de aquella manera, con muestras de tanta tristeza, le dijo: Sábete, Sancho, que no es un hombre más que otro si no hace más que otro. Todas estas borrascas que nos suceden son señales de que presto ha de serenar el tiempo y han de sucedernos bien las cosas; porque no es posible que el mal ni el bien sean durables, y de aquí se sigue que, habiendo durado mucho el mal, el bien está ya cerca. Así que, no debes congojarte por las desgracias que a mí me suceden, pues a ti no te cabe parte dellas.Y, viéndole don Quijote de aquella manera, con muestras de tanta tristeza, le dijo: Sábete, Sancho, que no es un hombre más que otro si no hace más que otro. Todas estas borrascas que nos suceden son señales de que presto ha de serenar el tiempo y han de sucedernos bien las cosas; porque no es posible que el mal ni el bien sean durables, y de aquí se sigue que, habiendo durado mucho el mal, el bien está ya cerca. Así que, no debes congojarte por las desgracias que a mí me suceden, pues a ti no te suceden.",
                false, complaint);

        Set<ConstraintViolation<ComplaintAppeal>> constraintViolations = validator.validate(complaintAppeal);

        ConstraintViolation<ComplaintAppeal> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("length must be between 0 and 200");
    }

    @Test
    void complaintCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        ComplaintAppeal complaintAppeal = new ComplaintAppeal("Contenido de la queja", false, null);

        Set<ConstraintViolation<ComplaintAppeal>> constraintViolations = validator.validate(complaintAppeal);

        ConstraintViolation<ComplaintAppeal> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void checkedCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        ComplaintAppeal complaintAppeal = new ComplaintAppeal("Contenido de la queja", null, complaint);

        Set<ConstraintViolation<ComplaintAppeal>> constraintViolations = validator.validate(complaintAppeal);

        ConstraintViolation<ComplaintAppeal> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

}
