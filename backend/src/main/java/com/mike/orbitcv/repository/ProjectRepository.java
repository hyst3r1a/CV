package com.mike.orbitcv.repository;

import com.mike.orbitcv.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findAllByOrderByDisplayOrderAsc();
}
