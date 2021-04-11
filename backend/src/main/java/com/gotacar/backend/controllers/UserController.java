package com.gotacar.backend.controllers;

import java.security.Key;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gotacar.backend.models.CarData;
import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;

import com.gotacar.backend.utils.TokenResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.bson.types.ObjectId;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class UserController {

	@Autowired
	private UserRepository userRepository;

	private static ObjectMapper objectMapper = new ObjectMapper();
@Autowired
private TripOrderRepository tripOrderRepository;

	@PostMapping("user")
	public TokenResponse login(@RequestParam("uid") String userId) {
		try {
			User user = userRepository.findByUid(userId);
			String token = getJWTToken(user);
			return new TokenResponse(token, user.getRoles());
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
		}
	}

	@GetMapping("current_user")
	public User currentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		User user = userRepository.findByEmail(authentication.getPrincipal().toString());
		return user;
	}

	@PostMapping("/register")
	@PreAuthorize("!hasRole('ROLE_ADMIN') && !hasRole('ROLE_CLIENT')")
	public User Register(@RequestBody String body){
           try {
			JsonNode jsonNode = objectMapper.readTree(body);
			User user = new User();

		   String firstName = objectMapper.readTree(jsonNode.get("firstName").toString()).asText();
		   String lastName = objectMapper.readTree(jsonNode.get("lastName").toString()).asText();
		   String uid = objectMapper.readTree(jsonNode.get("uid").toString()).asText();
		   String email = objectMapper.readTree(jsonNode.get("email").toString()).asText();
		   String dni = objectMapper.readTree(jsonNode.get("dni").toString()).asText();
		   String profilePhoto = objectMapper.readTree(jsonNode.get("profilePhoto").toString()).asText();
		   LocalDate birthdate = LocalDate.parse(objectMapper.readTree(jsonNode.get("birthdate").toString()).asText());
		   List<String> roles = new ArrayList<>();
		   roles.add("ROLE_CLIENT");

		  
		   user.setFirstName(firstName);
		   user.setLastName(lastName);
		   user.setUid(uid);
		   user.setEmail(email);
		   user.setDni(dni);
		   user.setProfilePhoto(profilePhoto);
		   user.setBirthdate(birthdate);
		   user.setRoles(roles);
		   user.setTimes_banned(0);
		   ObjectId userObjectId = new ObjectId();
		   user.setId(userObjectId.toString());
		   userRepository.save(user);

			return user;
		}  catch (Exception e){
			throw (new IllegalArgumentException(e.getMessage()));
		}
	}

	@PostMapping("/register_google")
	@PreAuthorize("!hasRole('ROLE_ADMIN') && !hasRole('ROLE_CLIENT')")
	public User RegisterGoogle(@RequestBody String body){
		
           try {
			JsonNode jsonNode = objectMapper.readTree(body);
			String email = objectMapper.readTree(jsonNode.get("email").toString()).asText();
			User user = userRepository.findByEmail(email);
			if (user==null){
				user = new User();

				String firstName = objectMapper.readTree(jsonNode.get("firstName").toString()).asText();
		   		String lastName = objectMapper.readTree(jsonNode.get("lastName").toString()).asText();
		   		String uid = objectMapper.readTree(jsonNode.get("uid").toString()).asText();
		   		String dni = objectMapper.readTree(jsonNode.get("dni").toString()).asText();
		   		String profilePhoto = objectMapper.readTree(jsonNode.get("profilePhoto").toString()).asText();
		   		LocalDate birthdate = LocalDate.parse(objectMapper.readTree(jsonNode.get("birthdate").toString()).asText());
		   		List<String> roles = new ArrayList<>();
		   		roles.add("ROLE_CLIENT");

		  
		   		user.setFirstName(firstName);
		   		user.setLastName(lastName);
		   		user.setUid(uid);
		   		user.setDni(dni);
				  user.setEmail(email);
		   		user.setProfilePhoto(profilePhoto);
		   		user.setBirthdate(birthdate);
		   		user.setRoles(roles);
		   		user.setTimes_banned(0);
		   		ObjectId userObjectId = new ObjectId();
		   		user.setId(userObjectId.toString());
		   		userRepository.save(user);

		   		return user;
			} else if (user.getFirstName().isEmpty()
			|| user.getLastName().isEmpty()
			|| user.getDni().isEmpty()
			|| user.getBirthdate()==null){
				String firstName = objectMapper.readTree(jsonNode.get("firstName").toString()).asText();
		   		String lastName = objectMapper.readTree(jsonNode.get("lastName").toString()).asText();
				String dni = objectMapper.readTree(jsonNode.get("dni").toString()).asText();
		   		String profilePhoto = objectMapper.readTree(jsonNode.get("profilePhoto").toString()).asText();
		   		LocalDate birthdate = LocalDate.parse(objectMapper.readTree(jsonNode.get("birthdate").toString()).asText());
				
		   		user.setFirstName(firstName);
		   		user.setLastName(lastName);
		   		user.setDni(dni);
		   		user.setProfilePhoto(profilePhoto);
		   		user.setBirthdate(birthdate);
		   		userRepository.save(user);
				
		   		return user;
			} else {
				return user;
			}
		}  catch (Exception e){
			throw (new IllegalArgumentException(e.getMessage()));
		}
	}

	@PostMapping("/edit_user")
	@PreAuthorize("hasRole('ROLE_CLIENT')")
	public User EditUser(@RequestBody String body){
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			User user = userRepository.findByEmail(authentication.getPrincipal().toString());

			JsonNode jsonNode = objectMapper.readTree(body);

			String firstName = objectMapper.readTree(jsonNode.get("firstName").toString()).asText();
			String lastName = objectMapper.readTree(jsonNode.get("lastName").toString()).asText();
			String email = objectMapper.readTree(jsonNode.get("email").toString()).asText();
			String profilePhoto = objectMapper.readTree(jsonNode.get("profilePhoto").toString()).asText();
			LocalDate birthdate = LocalDate.parse(objectMapper.readTree(jsonNode.get("birthdate").toString()).asText());
		   

		  
		   user.setFirstName(firstName);
		   user.setLastName(lastName);
		   user.setEmail(email);
		   user.setProfilePhoto(profilePhoto);
		   user.setBirthdate(birthdate);
		   //editar los datos del coche si es un conductor
		   if(user.getRoles().contains("ROLE_DRIVER")){
				String phone = objectMapper.readTree(jsonNode.get("phone").toString()).asText();
				String iban = objectMapper.readTree(jsonNode.get("iban").toString()).asText();

			   user.setPhone(phone);
			   user.setIban(iban);

		   }

		   userRepository.save(user);

			return user;
		} catch(Exception e){
			throw (new IllegalArgumentException(e.getMessage()));
		}
	}


	private String getJWTToken(User user) {
		String secretKey = "MiSecreto102993@asdfssGotacar1999ASSSS";
		String roles = String.join(",", user.getRoles());
		List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList(roles);
		Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
		String token = Jwts.builder().setId("softtekJWT").setSubject(user.getEmail())
				.claim("authorities",
						grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 3600000)).signWith(key).compact();
		return "Bearer " + token;
	}

	@PreAuthorize("hasRole('ROLE_CLIENT') AND !hasRole('ROLE_DRIVER')")
	@PostMapping("/driver/create")
	public User requestConversionToDriver(@RequestBody() String body) {
		try {
			JsonNode jsonNode = objectMapper.readTree(body);
			String uid = objectMapper.readTree(jsonNode.get("uid").toString()).asText();
			User u = this.userRepository.findByUid(uid);
			if (u.getBannedUntil() == null) {
				String phone = objectMapper.readTree(jsonNode.get("phone").toString()).asText();
				String iban = objectMapper.readTree(jsonNode.get("iban").toString()).asText();
				String driving_license = objectMapper.readTree(jsonNode.get("driving_license").toString()).asText();
				Integer experience = objectMapper.readTree(jsonNode.get("experience").toString()).asInt();
				JsonNode carDataJson = objectMapper.readTree(jsonNode.get("car_data").toString());

				ZonedDateTime enrollmentDateZone = ZonedDateTime
						.parse(objectMapper.readTree(carDataJson.get("enrollment_date").toString()).asText());
				enrollmentDateZone = enrollmentDateZone.withZoneSameInstant(ZoneId.of("Europe/Madrid"));
				LocalDate enrollmentDate = enrollmentDateZone.toLocalDate();

				CarData carData = new CarData(carDataJson.get("car_plate").asText(), enrollmentDate,
						carDataJson.get("model").asText(), carDataJson.get("color").asText());

				u.setPhone(phone);
				u.setIban(iban);
				u.setDrivingLicense(driving_license);
				u.setExperience(experience);
				u.setCarData(carData);
				u.setDriverStatus("PENDING");

				userRepository.save(u);
			} else {
				throw new Exception("Ahora mismo su cuenta se encuentra baneada");
			}
			return u;
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
		}
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/driver/update")
	public User convertToDriver(@RequestBody() String body) {
		try {
			JsonNode jsonNode = objectMapper.readTree(body);
			String uid = objectMapper.readTree(jsonNode.get("uid").toString()).asText();
			User u = this.userRepository.findByUid(uid);
			u.setDriverStatus("ACCEPTED");
			u.getRoles().add("ROLE_DRIVER");
			this.userRepository.save(u);

			return u;
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/enrolled-user/list")
	public List<User> listEnrrolledUsers() {
		try {
			return userRepository.findByRolesContaining("ROLE_CLIENT");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}

	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/driver-request/list")
	public List<User> findAllResquestDriver(){
		try {
			List<User> listUser = new ArrayList<>();
			listUser = userRepository.findByDriverStatus("PENDING");
            return listUser;
		} catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);	
        }	
		
	}
	@PreAuthorize("hasRole('ROLE_DRIVER')")
    @GetMapping("/list_users_trip/{tripId}")
    public List<User> listUsersTrip(@PathVariable(value = "tripId") String tripId) {
        try {
            List<User> lista = new ArrayList<>();
            Trip trip = tripRepository.findById(new ObjectId(tripId));
			List<TripOrder> tripOrders = tripOrderRepository.findByTrip(trip);

            for (TripOrder to: tripOrders){
                lista.add(to.getUser());
            }
            return lista;
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}
	
	@PreAuthorize("hasRole('ROLE_CLIENT')")
	@PostMapping("/delete-account")
    public User deleteAccount() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(authentication.getPrincipal().toString());
			List<Trip> trips = tripRepository.findByDriverAndCanceled(user, false);
			List<TripOrder> tripOrders = tripOrderRepository.findByUserAndStatus(user, "PROCCESSING");
			if(trips.isEmpty() && tripOrders.isEmpty()){
				userRepository.delete(user);
			}
			return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/delete-penalized-account")
    public List<User> deletePenalizedAccount() {
        try {
			List<User> users = userRepository.findByTimesBannedGreaterThan(3);
			for (User user : users){
				List<Trip> trips = tripRepository.findByDriverAndCanceled(user, false);
				List<TripOrder> tripOrders = tripOrderRepository.findByUserAndStatus(user, "PROCCESSING");
				if(trips.isEmpty() && tripOrders.isEmpty()){
					userRepository.delete(user);
				}
			}
			return users;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}