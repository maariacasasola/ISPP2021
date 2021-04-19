package com.gotacar.backend.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import com.gotacar.backend.models.paymentReturn.PaymentReturn;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentReturnTests {
    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private final Validator validator = createValidator();

    private static User client;

    @BeforeAll
    private static void setData() {
        List<String> authorities = new ArrayList<String>();
        authorities.add("ROLE_CLIENT");
        LocalDate birthdate1 = LocalDate.of(1999, 10, 10);
        client = new User("Manuel", "Fernandez", "1", "manan@gmail.com", "312312312", "http://dasdasdas.com",
                birthdate1, authorities, "655757575");
    }

    @Test
    void userCantBeNull() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        PaymentReturn paymentReturn = new PaymentReturn(null, 200);

        Set<ConstraintViolation<PaymentReturn>> constraintViolations = validator.validate(paymentReturn);

        ConstraintViolation<PaymentReturn> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("must not be null");
    }

    @Test
    void createdAtMustBeAuto() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);

        PaymentReturn paymentReturn = new PaymentReturn(client, 299);

        assertThat(paymentReturn.createdAt).isNotNull();
    }
}
