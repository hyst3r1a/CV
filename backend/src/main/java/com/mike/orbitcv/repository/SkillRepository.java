package com.mike.orbitcv.repository;

import com.mike.orbitcv.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<SkillEntity, Long> {
    List<SkillEntity> findAllByOrderByProficiencyDesc();
}
