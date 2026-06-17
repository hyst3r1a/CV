package com.mike.orbitcv.service;

import com.mike.orbitcv.entity.SkillEntity;
import com.mike.orbitcv.repository.SkillRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SkillService {

    private final SkillRepository repo;

    public SkillService(SkillRepository repo) {
        this.repo = repo;
    }

    public List<SkillEntity> findAll() {
        return repo.findAllByOrderByProficiencyDesc();
    }
}
