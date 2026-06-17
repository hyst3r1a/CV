package com.mike.orbitcv.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AdminAuth {

    @Value("${ADMIN_TOKEN:change-me}")
    private String adminToken;

    public void require(String token) {
        if (token == null || token.isBlank() || !token.equals(adminToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin token");
        }
    }
}
