package com.gotacar.backend.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Past;
import javax.validation.constraints.Pattern;

import org.bson.codecs.pojo.annotations.BsonProperty;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
  @Id
  private String id;

  @NotBlank
  private String firstName;

  @NotBlank
  private String lastName;

  @NotBlank
  @Indexed(unique = true)
  private String uid;

  @Email(message = "Invalid email")
  private String email;

  @Pattern(regexp = "[0-9]{8,8}[A-Z]", message = "Invalid dni number")
  private String dni;

  @URL(message = "Photo must be an url")
  private String profilePhoto;

  @Past(message = "Invalid birthdate")
  private LocalDate birthdate;

  private List<String> roles;

  @Future
  private LocalDateTime bannedUntil;

  @Pattern(regexp = "PENDING|ACCEPTED", message = "El estado de la validación del conductar solo puede ser: (PENDING|ACCEPTED)")
  private String driverStatus;

  private String phone;

  private String iban;

  private Integer timesBanned;

  @URL(message = "Driving license must be an url")
  private String drivingLicense;

  private Integer experience;

  @BsonProperty("car_data")
  private CarData carData;

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
    this.bannedUntil = null;
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
    this.bannedUntil = bannedUntil;
  }

  public User( String firstName, String lastName,  String uid,
      String email, String dni, String profilePhoto, LocalDate birthdate, List<String> roles, LocalDateTime bannedUntil,
      String phone, String iban, Integer timesBanned,  String drivingLicense,
      Integer experience, CarData carData) {

    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;
    this.bannedUntil = bannedUntil;
    this.driverStatus = null;
    this.phone = phone;
    this.iban = iban;
    this.timesBanned = timesBanned;
    this.drivingLicense = drivingLicense;
    this.experience = experience;
    this.carData = carData;
  }

  @Override
  public String toString() {
    return String.format("Customer[id=%s]", id);
  }

}