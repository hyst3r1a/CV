package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.ProjectDto;
import com.mike.orbitcv.entity.ProjectEntity;
import com.mike.orbitcv.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public ProjectDto create(ProjectDto dto) {
        ProjectEntity entity = new ProjectEntity();
        applyDto(entity, dto);
        return toDto(repo.save(entity));
    }

    public ProjectDto update(Long id, ProjectDto dto) {
        ProjectEntity entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        applyDto(entity, dto);
        return toDto(repo.save(entity));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        repo.deleteById(id);
    }

    private ProjectDto toDto(ProjectEntity e) {
        ProjectDto dto = new ProjectDto();
        dto.setId(e.getId());
        dto.setTitle(e.getTitle());
        dto.setDescription(e.getDescription());
        dto.setTechStack(e.getTechStack() == null ? List.of()
                : Arrays.stream(e.getTechStack().split(",")).map(String::trim).collect(Collectors.toList()));
        dto.setVideoUrl(e.getVideoUrl());
        dto.setThumbnailUrl(e.getThumbnailUrl());
        dto.setGithubUrl(e.getGithubUrl());
        dto.setFeatured(e.isFeatured());
        dto.setDisplayOrder(e.getDisplayOrder());
        return dto;
    }

    private void applyDto(ProjectEntity entity, ProjectDto dto) {
        entity.setTitle(ContentSanitizer.text(dto.getTitle(), 160));
        entity.setDescription(ContentSanitizer.text(dto.getDescription(), 2000));
        entity.setTechStack(ContentSanitizer.techStack(dto.getTechStack()));
        entity.setVideoUrl(ContentSanitizer.nullableUrl(dto.getVideoUrl()));
        entity.setThumbnailUrl(ContentSanitizer.nullableUrl(dto.getThumbnailUrl()));
        entity.setGithubUrl(ContentSanitizer.nullableUrl(dto.getGithubUrl()));
        entity.setFeatured(dto.isFeatured());
        entity.setDisplayOrder(ContentSanitizer.clamp(dto.getDisplayOrder(), -1000, 1000));
    }
}
