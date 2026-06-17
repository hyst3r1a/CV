package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.TimelineEventDto;
import com.mike.orbitcv.entity.TimelineEventEntity;
import com.mike.orbitcv.repository.TimelineEventRepository;
import org.springframework.stereotype.Service;

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
}
