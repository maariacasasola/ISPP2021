package com.gotacar.backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import javax.validation.ConstraintViolation;

import com.gotacar.backend.models.MeetingPoint;

import org.junit.jupiter.api.Test;

import javax.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

public class MeetingPointModelTests {

    private Validator createValidator() {
        LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
        localValidatorFactoryBean.afterPropertiesSet();
        return localValidatorFactoryBean;
    }

    private Validator validator = createValidator();

    @Test
    public void setMaxDirectionLength(){
        MeetingPoint mp1 = new MeetingPoint(4.92384, 5.283749, "Un limón y medio limón, Dos limones y medio limón, Tres limones y medio limón, Cuatro limones y medio limón, Cinco limones y medio limón, Seis limones y medio limón, Siete limones y medio limón, Ocho limones y medio limón, Se que parece una película de Greenaway, Pero es tan solo un ejercicio de malabarismo, Me da lo mismo que nadie lo pueda entender, Yo y mis limones tenemos tanto de que hablar", "Nombre");
        Set<ConstraintViolation<MeetingPoint>> constraintViolations = validator.validate(mp1);

		ConstraintViolation<MeetingPoint> violation = constraintViolations.iterator().next();
		assertThat(violation.getMessage()).isEqualTo("La longitud de la dirección no puede ser mayor a 240");
    }

    @Test
    public void setNullLongitud() {
        MeetingPoint mp1 = new MeetingPoint(null, 4.0310, "Name", "Direction");
        Set<ConstraintViolation<MeetingPoint>> constraintViolations = validator.validate(mp1);

        ConstraintViolation<MeetingPoint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("no debe ser nulo");
    }
    
    @Test
    public void setNullLatitud() {
        MeetingPoint mp1 = new MeetingPoint(0.1283971, null, "Name", "Direction");
        Set<ConstraintViolation<MeetingPoint>> constraintViolations = validator.validate(mp1);

        ConstraintViolation<MeetingPoint> violation = constraintViolations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("no debe ser nulo");
    }

    @Test
    public void setNullLatitudAndLongitud() {
        MeetingPoint mp1 = new MeetingPoint(null, null, "Name", "Direction");
        Set<ConstraintViolation<MeetingPoint>> constraintViolations = validator.validate(mp1);
        assertThat(constraintViolations.size()).isEqualTo(2);
    }
}