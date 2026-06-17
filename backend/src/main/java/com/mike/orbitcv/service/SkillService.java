package com.mike.orbitcv.service;

import com.mike.orbitcv.dto.SkillDto;
import com.mike.orbitcv.entity.SkillEntity;
import com.mike.orbitcv.repository.SkillRepository;
import org.springframework.stereotype.Service;

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

    private SkillDto toDto(SkillEntity e) {
        SkillDto dto = new SkillDto();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setCategory(e.getCategory());
        dto.setProficiency(e.getProficiency());
        dto.setColor(e.getColor());
        return dto;
    }
}
