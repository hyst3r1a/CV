package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.SkillDto;
import com.mike.orbitcv.entity.SkillEntity;
import com.mike.orbitcv.repository.SkillRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository repo;

    public SkillService(SkillRepository repo) {
        this.repo = repo;
    }

    public List<SkillDto> findAll() {
        return repo.findAllByOrderByProficiencyDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public SkillDto create(SkillDto dto) {
        SkillEntity entity = new SkillEntity();
        applyDto(entity, dto);
        return toDto(repo.save(entity));
    }

    public SkillDto update(Long id, SkillDto dto) {
        SkillEntity entity = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));
        applyDto(entity, dto);
        return toDto(repo.save(entity));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found");
        }
        repo.deleteById(id);
    }

    private SkillDto toDto(SkillEntity e) {
        SkillDto dto = new SkillDto();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setCategory(e.getCategory());
        dto.setProficiency(e.getProficiency());
        dto.setColor(e.getColor());
        return dto;
    }

    private void applyDto(SkillEntity entity, SkillDto dto) {
        entity.setName(ContentSanitizer.text(dto.getName(), 80));
        entity.setCategory(ContentSanitizer.text(dto.getCategory(), 80));
        entity.setProficiency(ContentSanitizer.clamp(dto.getProficiency(), 0, 100));
        entity.setColor(ContentSanitizer.color(dto.getColor()));
    }
}
