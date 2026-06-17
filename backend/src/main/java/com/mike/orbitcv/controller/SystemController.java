package com.mike.orbitcv.controller;

import com.mike.orbitcv.dto.SystemStatusDto;
import com.mike.orbitcv.service.SystemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final SystemService service;

    public SystemController(SystemService service) {
        this.service = service;
    }

    @GetMapping
    public SystemStatusDto getSystem() {
        return service.getStatus();
    }
}
