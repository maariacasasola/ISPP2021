package com.gotacar.backend.utils;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponse {
    public String token;

    public TokenResponse(String token) {
        this.token = token;
    }
}
