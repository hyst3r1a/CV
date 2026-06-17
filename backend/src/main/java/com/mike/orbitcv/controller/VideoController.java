package com.mike.orbitcv.controller;

import com.mike.orbitcv.dto.VideoDto;
import com.mike.orbitcv.service.VideoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService service;

    public VideoController(VideoService service) {
        this.service = service;
    }

    @GetMapping
    public List<VideoDto> getVideos() {
        return service.findAll();
    }
}
