package com.gotacar.backend.models.paymentReturn;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.gotacar.backend.models.User;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentReturn {
    @Id
    public String id;

    @DBRef
    @NotNull
    public User user;

    @NotNull
    public Integer amount;

    @Pattern(regexp = "PENDING|DONE", message = "El estado de la devolución solo puede ser: (PENDING|DONE)")
    public String status;

    @NotNull
    public LocalDateTime createdAt;

    public LocalDateTime acceptedAt;

    public PaymentReturn(User user, Integer amount) {
        this.user = user;
        this.amount = amount;
        ZonedDateTime dateStartZone = ZonedDateTime.now();
        dateStartZone = dateStartZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
        this.createdAt = dateStartZone.toLocalDateTime();
        this.status = "PENDING";
    }
}
