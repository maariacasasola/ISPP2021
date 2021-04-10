package com.gotacar.backend.controllers;

import java.security.Key;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
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
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/list_enrolled_users")
	public List<User> listEnrrolledUsers(){
		try {
			return userRepository.findByRolesContaining("ROLE_CLIENT");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
		}
	}
	
	@PreAuthorize("hasRole('ROLE_CLIENT')")
	@RequestMapping("/delete-account")
    public User deleteAccount() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(authentication.getPrincipal().toString());
			List<Trip> trips = tripRepository.findByDriverAndCanceled(user, false);
			List<TripOrder> tripOrders = tripOrderRepository.findByUserAndStatus(user, "PROCCESSING");
			if(trips.size()==0 && tripOrders.size()==0){
				userRepository.delete(user);
			}
			return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        }
    }
}