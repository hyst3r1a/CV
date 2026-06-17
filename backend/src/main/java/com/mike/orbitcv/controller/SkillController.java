package com.mike.orbitcv.controller;

import com.mike.orbitcv.entity.SkillEntity;
import com.mike.orbitcv.service.SkillService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    @GetMapping
    public List<SkillEntity> getSkills() {
        return service.findAll();
    }
}
