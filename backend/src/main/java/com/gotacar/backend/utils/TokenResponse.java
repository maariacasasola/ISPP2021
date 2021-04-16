package com.gotacar.backend.utils;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TokenResponse {
    public String token;

    public List<String> roles;
    
    public LocalDateTime bannedUntil;

    public TokenResponse(String token, List<String> roles, LocalDateTime bannedUntil) {
        this.token = token; this.roles = roles; this.bannedUntil=bannedUntil;
    }
}
