package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.TimelineEventDto;
import com.mike.orbitcv.entity.TimelineEventEntity;
import com.mike.orbitcv.repository.TimelineEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimelineService {

    private final TimelineEventRepository repo;

    public TimelineService(TimelineEventRepository repo) {
        this.repo = repo;
    }

    public List<TimelineEventDto> findAll() {
        return repo.findAllByOrderByDisplayOrderAsc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public TimelineEventDto create(TimelineEventDto dto) {
        TimelineEventEntity entity = new TimelineEventEntity();
        applyDto(entity, dto);
        return toDto(repo.save(entity));
    }

    public TimelineEventDto update(Long id, TimelineEventDto dto) {
        TimelineEventEntity entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Timeline event not found"));
        applyDto(entity, dto);
        return toDto(repo.save(entity));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Timeline event not found");
        }
        repo.deleteById(id);
    }

    private TimelineEventDto toDto(TimelineEventEntity e) {
        TimelineEventDto dto = new TimelineEventDto();
        dto.setId(e.getId());
        dto.setYear(e.getYear());
        dto.setTitle(e.getTitle());
        dto.setCompany(e.getCompany());
        dto.setDescription(e.getDescription());
        dto.setType(e.getType());
        dto.setDisplayOrder(e.getDisplayOrder());
        return dto;
    }

    private void applyDto(TimelineEventEntity entity, TimelineEventDto dto) {
        entity.setYear(ContentSanitizer.clamp(dto.getYear(), 1900, 2100));
        entity.setTitle(ContentSanitizer.text(dto.getTitle(), 160));
        entity.setCompany(ContentSanitizer.text(dto.getCompany(), 120));
        entity.setDescription(ContentSanitizer.text(dto.getDescription(), 1000));
        entity.setType(ContentSanitizer.timelineType(dto.getType()));
        entity.setDisplayOrder(ContentSanitizer.clamp(dto.getDisplayOrder(), -1000, 1000));
    }
}
