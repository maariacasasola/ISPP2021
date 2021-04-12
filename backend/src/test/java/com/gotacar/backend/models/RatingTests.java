package com.gotacar.backend.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.gotacar.backend.models.rating.Rating;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import static org.assertj.core.api.Assertions.assertThat;

public class RatingTests {
    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private final Validator validator = createValidator();

    private static User client;
    private static User driver;

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
    }

    @Test
    public void ratingCreateSuccess(){
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Mala conducción", 1);
        
        assertThat(rating.getCreatedAt()).isNotNull();
    }

    @Test
    public void userFromCantBeNull(){
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(null, driver, "Buena compañía", 4);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void userToCantBeNull(){
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, null, "Mala conducción", 2);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    public void contentCantBeBlank(){
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "", 3);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be blank");
    }

    @Test
    public void pointsMinTest(){
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Mala conducción", -3);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be greater than or equal to 1");
    }

    @Test
    public void pointsMaxTest(){
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        Rating rating = new Rating(client, driver, "Buena conducción", 6);

        Set<ConstraintViolation<Rating>> constraintViolations = validator.validate(rating);

        ConstraintViolation<Rating> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must be less than or equal to 5");
    }
}
