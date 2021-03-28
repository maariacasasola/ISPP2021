package com.gotacar.backend.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
  @Id
  public String id;

  @NotBlank
  public String firstName;

  @NotBlank
  public String lastName;

  @NotBlank
  @Indexed(unique = true)
  public String uid;

  @Email(message = "Invalid email")
  public String email;

  @Pattern(regexp = "[0-9]{8,8}[A-Z]", message = "Invalid dni number")
  public String dni;

  @URL(message = "Photo must be an url")
  public String profilePhoto;

  @Past(message = "Invalid birthdate")
  public LocalDate birthdate;

  public List<String> roles;

  @Future
  public LocalDateTime bannedUntil;

  public User() {
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto,
      LocalDate birthdate, List<String> roles) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;
    this.bannedUntil=null;
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto,
      LocalDate birthdate, List<String> roles, LocalDateTime bannedUntil) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;
    this.bannedUntil=bannedUntil;
  }

  @Override
  public String toString() {
    return String.format("Customer[id=%s]", id);
  }
}