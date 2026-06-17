package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.VideoDto;
import com.mike.orbitcv.entity.VideoEntity;
import com.mike.orbitcv.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private final VideoRepository repo;

    public VideoService(VideoRepository repo) {
        this.repo = repo;
    }

    public List<VideoDto> findAll() {
        return repo.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private VideoDto toDto(VideoEntity e) {
        VideoDto dto = new VideoDto();
        dto.setId(e.getId());
        dto.setTitle(e.getTitle());
        dto.setDescription(e.getDescription());
        dto.setEmbedUrl(e.getEmbedUrl());
        dto.setThumbnailUrl(e.getThumbnailUrl());
        dto.setProjectId(e.getProjectId());
        return dto;
    }
}
