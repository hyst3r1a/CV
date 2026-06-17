package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.SystemStatusDto;
import com.mike.orbitcv.repository.ProjectRepository;
import com.mike.orbitcv.repository.SkillRepository;
import com.mike.orbitcv.repository.TimelineEventRepository;
import com.mike.orbitcv.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class SystemService {

    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final TimelineEventRepository timelineRepo;
    private final VideoRepository videoRepo;

    @Value("${FRONTEND_ORIGIN:http://localhost:5173}")
    private String frontendOrigin;

    private final Instant startedAt = Instant.now();

    public SystemService(ProjectRepository p, SkillRepository s,
                         TimelineEventRepository t, VideoRepository v) {
        this.projectRepo = p;
        this.skillRepo = s;
        this.timelineRepo = t;
        this.videoRepo = v;
    }

    public SystemStatusDto getStatus() {
        SystemStatusDto dto = new SystemStatusDto();
        dto.setService("orbital-cv-backend");
        dto.setRuntime("Spring Boot 3.2");
        dto.setOrm("Hibernate 6 / JPA");
        dto.setDatabase("SQLite (sqlite-jdbc)");
        dto.setStatus("online");
        dto.setProjectCount(projectRepo.count());
        dto.setSkillCount(skillRepo.count());
        dto.setTimelineEvents(timelineRepo.count());
        dto.setVideoCount(videoRepo.count());
        dto.setStartedAt(startedAt.toString());
        dto.setFrontendOrigin(frontendOrigin);
        dto.setVersion("1.0.0");
        return dto;
    }
}
