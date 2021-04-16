package com.gotacar.backend.models.rating;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.gotacar.backend.models.User;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Rating {

    @Id
    public String id;

    @DBRef
    @NotNull
    public User from;

    @DBRef
    @NotNull
    public User to;

    @NotBlank
    public String content;

    @Min(1)
    @Max(5)
    public Integer points;

    private LocalDateTime createdAt;

    public Rating() {

    }

    public Rating(User from, User to, String content, Integer points) {
    	ZonedDateTime actualDate = ZonedDateTime.now();
		actualDate = actualDate.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
        this.from = from;
        this.to = to;
        this.points = points;
        this.content = content;
        this.createdAt = actualDate.toLocalDateTime();
    }

    @Override
    public String toString() {
        return String.format("Rating[id=%s, from=%s, to=%s, points:%s, content:%s]", id, from.getId(), to.getId(),
                points.toString(), content);
    }
}
