package com.gotacar.backend.models;

import java.time.LocalDate;
import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
public class User {
  @Id
  public String id;
  @NotBlank
  public String firstName;

  public String lastName;

  public String uid;

  public String email;

  public String dni;

  public String profilePhoto;

  public LocalDate birthdate;

  public List<String> roles; 


  public User() {
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto, LocalDate birthdate, List<String> roles) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;

  }

  @Override
  public String toString() {
    return String.format("Customer[id=%s]", id);
  }
}