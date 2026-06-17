package com.mike.orbitcv.controller;

import com.mike.orbitcv.dto.ContactIntentRequest;
import com.mike.orbitcv.entity.ContactIntentEntity;
import com.mike.orbitcv.repository.ContactIntentRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/contact-intent")
public class ContactController {

    private final ContactIntentRepository repo;

    public ContactController(ContactIntentRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactIntentRequest req) {
        ContactIntentEntity entity = new ContactIntentEntity();
        entity.setName(req.getName());
        entity.setEmail(req.getEmail());
        entity.setMessage(req.getMessage());
        entity.setCreatedAt(Instant.now().toString());
        repo.save(entity);
        return ResponseEntity.ok(Map.of("status", "received", "message", "Thank you, " + req.getName() + "!"));
    }
}
