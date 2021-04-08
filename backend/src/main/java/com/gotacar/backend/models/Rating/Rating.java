package com.gotacar.backend.models.Rating;

import java.time.LocalDateTime;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;

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

    @NotNull
    @DBRef
    public User from;

    @NotNull
    @DBRef
    public User to;

    @NotBlank
    public String content;

    @Min(1)
    @Max(5)
    public Integer points;

    @Past
    @NotNull
    public LocalDateTime created_at;

    public Rating() {

    }

    public Rating(User from, User to, String content, Integer points) {
        this.from = from;
        this.to = to;
        this.points = points;
        this.created_at = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return String.format("Rating[id=%s, from=%s, to=%s, points:%s, content:%s]", id, from.getId(), to.getId(),
                points.toString(), content);
    }
}
