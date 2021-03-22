package com.gotacar.backend.utils;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TokenResponse {
    public String token;

    public List<String> roles;

    public TokenResponse(String token, List<String> roles) {
        this.token = token; this.roles = roles;
    }
}
