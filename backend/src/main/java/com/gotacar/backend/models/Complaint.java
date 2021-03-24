package com.gotacar.backend.models;

import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
	public LocalDateTime creationDate;
	
	@Pattern(regexp = "PENDING|ALREADY_RESOLVED|ACCEPTED|REFUSED", message="El estado de la queja solo puede ser: (PENDING|ALREADY_RESOLVED|ACCEPTED|REFUSED)")
	public String status;
	
	public Complaint() {
	}
	
	public Complaint(String title, String content, User user, LocalDateTime creationDate) {
		this.title = title;
		this.content = content;
		this.user = user;
		this.creationDate = creationDate;
		this.status = "PENDING";
	}
	
	@Override
    public String toString() {
        return String.format("Complaint[id=%s, title=%s, user=%s]", id, title, user.toString());
    }

}
