package com.mike.orbitcv.service;

import com.mike.orbitcv.entity.TimelineEventEntity;
import com.mike.orbitcv.repository.TimelineEventRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TimelineService {

    private final TimelineEventRepository repo;

    public TimelineService(TimelineEventRepository repo) {
        this.repo = repo;
    }

    public List<TimelineEventEntity> findAll() {
        return repo.findAllByOrderByDisplayOrderAsc();
    }
}
