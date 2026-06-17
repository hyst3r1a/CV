package com.mike.orbitcv.controller;

import com.mike.orbitcv.entity.TimelineEventEntity;
import com.mike.orbitcv.service.TimelineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/timeline")
public class TimelineController {

    private final TimelineService service;

    public TimelineController(TimelineService service) {
        this.service = service;
    }

    @GetMapping
    public List<TimelineEventEntity> getTimeline() {
        return service.findAll();
    }
}
