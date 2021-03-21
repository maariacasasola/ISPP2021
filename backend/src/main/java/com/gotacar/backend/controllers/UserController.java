package com.gotacar.backend.controllers;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;
import com.gotacar.backend.utils.TokenResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@RestController
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@PostMapping("user")
	public TokenResponse login(@RequestParam("uid") String userId) {
		User user = userRepository.findByUid(userId);
		String token = getJWTToken(user);
		TokenResponse generatedToken = new TokenResponse(token);
		return generatedToken;
	}

	private String getJWTToken(User user) {
		String secretKey = "MiSecreto102993@asdfssGotacar1999ASSSS";
		String roles = user.getRoles().stream().collect(Collectors.joining(","));
		List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList(roles);
		Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
		String token = Jwts.builder().setId("softtekJWT").setSubject(user.getEmail())
				.claim("authorities",
						grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 600000)).signWith(key).compact();

		return "Bearer " + token;
	}
}