package com.studio.creator.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studio.creator.model.ScriptEntity;

@Repository
public interface ScriptRepository extends JpaRepository<ScriptEntity, Long> {
    List<ScriptEntity> findByPlatformOrderByCreatedAtDesc(String platform);
}
