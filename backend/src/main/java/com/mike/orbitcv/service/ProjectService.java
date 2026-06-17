package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.ProjectDto;
import com.mike.orbitcv.entity.ProjectEntity;
import com.mike.orbitcv.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository repo;

    public ProjectService(ProjectRepository repo) {
        this.repo = repo;
    }

    public List<ProjectDto> findAll() {
        return repo.findAllByOrderByDisplayOrderAsc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private ProjectDto toDto(ProjectEntity e) {
        ProjectDto dto = new ProjectDto();
        dto.setId(e.getId());
        dto.setTitle(e.getTitle());
        dto.setDescription(e.getDescription());
        dto.setTechStack(e.getTechStack() == null ? List.of()
                : Arrays.asList(e.getTechStack().split(",")));
        dto.setVideoUrl(e.getVideoUrl());
        dto.setThumbnailUrl(e.getThumbnailUrl());
        dto.setGithubUrl(e.getGithubUrl());
        dto.setFeatured(e.isFeatured());
        dto.setDisplayOrder(e.getDisplayOrder());
        return dto;
    }
}
