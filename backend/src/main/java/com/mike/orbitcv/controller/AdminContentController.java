package com.mike.orbitcv.controller;

import com.mike.orbitcv.dto.ProjectDto;
import com.mike.orbitcv.dto.SkillDto;
import com.mike.orbitcv.dto.TimelineEventDto;
import com.mike.orbitcv.service.ProjectService;
import com.mike.orbitcv.service.SkillService;
import com.mike.orbitcv.service.TimelineService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminContentController {

    private final AdminAuth auth;
    private final ProjectService projects;
    private final SkillService skills;
    private final TimelineService timeline;

    public AdminContentController(
            AdminAuth auth,
            ProjectService projects,
            SkillService skills,
            TimelineService timeline
    ) {
        this.auth = auth;
        this.projects = projects;
        this.skills = skills;
        this.timeline = timeline;
    }

    @PostMapping("/projects")
    public ProjectDto createProject(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @RequestBody ProjectDto dto
    ) {
        auth.require(token);
        return projects.create(dto);
    }

    @PutMapping("/projects/{id}")
    public ProjectDto updateProject(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @PathVariable Long id,
            @RequestBody ProjectDto dto
    ) {
        auth.require(token);
        return projects.update(id, dto);
    }

    @DeleteMapping("/projects/{id}")
    public void deleteProject(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @PathVariable Long id
    ) {
        auth.require(token);
        projects.delete(id);
    }

    @PostMapping("/skills")
    public SkillDto createSkill(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @RequestBody SkillDto dto
    ) {
        auth.require(token);
        return skills.create(dto);
    }

    @PutMapping("/skills/{id}")
    public SkillDto updateSkill(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @PathVariable Long id,
            @RequestBody SkillDto dto
    ) {
        auth.require(token);
        return skills.update(id, dto);
    }

    @DeleteMapping("/skills/{id}")
    public void deleteSkill(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @PathVariable Long id
    ) {
        auth.require(token);
        skills.delete(id);
    }

    @PostMapping("/timeline")
    public TimelineEventDto createTimelineEvent(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @RequestBody TimelineEventDto dto
    ) {
        auth.require(token);
        return timeline.create(dto);
    }

    @PutMapping("/timeline/{id}")
    public TimelineEventDto updateTimelineEvent(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @PathVariable Long id,
            @RequestBody TimelineEventDto dto
    ) {
        auth.require(token);
        return timeline.update(id, dto);
    }

    @DeleteMapping("/timeline/{id}")
    public void deleteTimelineEvent(
            @RequestHeader(value = "X-Admin-Token", required = false) String token,
            @PathVariable Long id
    ) {
        auth.require(token);
        timeline.delete(id);
    }
}
