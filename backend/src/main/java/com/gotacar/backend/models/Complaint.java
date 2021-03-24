package com.gotacar.backend.models;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.gotacar.backend.models.Trip.Trip;

import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Complaint {

	@Id
	public String id;

	@NotBlank
	public String title;

	@NotBlank
	public String content;

	@NotNull
	public User user;

	@NotNull
	public Trip trip;

	@NotNull
	public LocalDateTime creationDate;

	@Pattern(regexp = "PENDING|ALREADY_RESOLVED|ACCEPTED|REFUSED", message = "El estado de la queja solo puede ser: (PENDING|ALREADY_RESOLVED|ACCEPTED|REFUSED)")
	public String status;

	public Complaint() {
	}

	public Complaint(String title, String content, Trip trip, User user, LocalDateTime creationDate) {
		this.title = title;
		this.trip = trip;
		this.content = content;
		this.user = user;
		this.creationDate = creationDate;
		this.status = "PENDING";
	}

	public Complaint(String title, String content, Trip trip, User user, LocalDateTime creationDate, String status) {
		this.title = title;
		this.trip = trip;
		this.content = content;
		this.user = user;
		this.creationDate = creationDate;
		this.status = status;
	}

	@Override
	public String toString() {
		return String.format("Complaint[id=%s, title=%s, user=%s, trip:%s]", id, title, user.toString(), trip.toString());
	}

}
