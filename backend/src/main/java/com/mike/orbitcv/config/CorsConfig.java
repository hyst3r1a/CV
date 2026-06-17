package com.mike.orbitcv.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${FRONTEND_ORIGINS:${FRONTEND_ORIGIN:http://localhost:5173}}")
    private String frontendOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] allowedOrigins = normalizeOrigins(frontendOrigins);

                registry.addMapping("/api/admin/**")
                        .allowedOriginPatterns(allowedOrigins)
                        .allowedMethods("POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Content-Type", "X-Admin-Token")
                        .maxAge(3600);

                registry.addMapping("/api/**")
                        .allowedOriginPatterns(allowedOrigins)
                        .allowedMethods("GET", "OPTIONS")
                        .allowedHeaders("Content-Type")
                        .maxAge(3600);
            }
        };
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
