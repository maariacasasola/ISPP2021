package com.gotacar.backend.controllers;

import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.models.Trip.Trip;
import com.gotacar.backend.models.Trip.TripRepository;
import com.gotacar.backend.models.TripOrder.TripOrder;
import com.gotacar.backend.models.TripOrder.TripOrderRepository;
import com.gotacar.backend.utils.TokenResponse;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@RestController
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TripRepository tripRepository;

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
	public User currentUser(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getPrincipal().toString());
		return user;
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

}