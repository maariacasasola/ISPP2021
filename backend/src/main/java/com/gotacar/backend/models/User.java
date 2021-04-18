package com.gotacar.backend.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.Future;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
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

  private List<String> roles;

  @Future
  public LocalDateTime bannedUntil;

  @Pattern(regexp = "PENDING|ACCEPTED", message = "El estado de la validación del conductar solo puede ser: (PENDING|ACCEPTED)")
  public String driverStatus;

  private String phone;

  @Pattern(regexp = "([a-zA-Z]{2}\\d{2})(\\d{4})(\\d{4})(\\d{2})(\\d{10})", message = "Iban incorrecto, debe seguir el formato ES1111111111111111111111")
  private String iban;

  private Integer timesBanned;

  @Min(1)
  @Max(5)
  private Integer averageRatings;

  @URL(message = "Driving license must be an url")
  public String drivingLicense;

  private Integer experience;

  @BsonProperty("car_data")
  public CarData carData;

  public User() {
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto,
      LocalDate birthdate, List<String> roles, String phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;
    this.phone = phone;
    this.bannedUntil = null;
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto,
      LocalDate birthdate, List<String> roles, String phone, LocalDateTime bannedUntil) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.uid = uid;
    this.email = email;
    this.dni = dni;
    this.profilePhoto = profilePhoto;
    this.birthdate = birthdate;
    this.roles = roles;
    this.bannedUntil = bannedUntil;
    this.phone = phone;
  }

  public User(String firstName, String lastName, String uid, String email, String dni, String profilePhoto,
      LocalDate birthdate, List<String> roles, LocalDateTime bannedUntil, String phone, String iban,
      Integer timesBanned, String drivingLicense, Integer experience, CarData carData) {

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