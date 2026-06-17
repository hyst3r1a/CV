package com.mike.orbitcv.repository;

import com.mike.orbitcv.entity.TimelineEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimelineEventRepository extends JpaRepository<TimelineEventEntity, Long> {
    List<TimelineEventEntity> findAllByOrderByDisplayOrderAsc();
}
