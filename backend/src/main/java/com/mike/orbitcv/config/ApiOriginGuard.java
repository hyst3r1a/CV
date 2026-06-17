package com.mike.orbitcv.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
public class ApiOriginGuard extends OncePerRequestFilter {

    @Value("${FRONTEND_ORIGINS:${FRONTEND_ORIGIN:http://localhost:5173}}")
    private String frontendOrigins;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/") || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String origin = request.getHeader("Origin");
        String referer = request.getHeader("Referer");
        boolean allowed = Arrays.stream(normalizeOrigins(frontendOrigins))
                .anyMatch((allowedOrigin) ->
                        allowedOrigin.equals(origin)
                                || (referer != null && referer.startsWith(allowedOrigin + "/"))
                );

        if (!allowed) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden origin");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String[] normalizeOrigins(String origins) {
        if (origins == null || origins.isBlank()) return new String[] { "http://localhost:5173" };
        return Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter((origin) -> !origin.isBlank())
                .map((origin) -> origin.endsWith("/") ? origin.substring(0, origin.length() - 1) : origin)
                .toArray(String[]::new);
    }
}
