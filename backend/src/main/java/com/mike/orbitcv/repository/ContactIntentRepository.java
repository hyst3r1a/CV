package com.mike.orbitcv.repository;

import com.mike.orbitcv.entity.ContactIntentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactIntentRepository extends JpaRepository<ContactIntentEntity, Long> {
}
