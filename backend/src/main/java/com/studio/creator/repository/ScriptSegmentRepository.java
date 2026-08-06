package com.studio.creator.repository;

import com.studio.creator.model.ScriptSegmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScriptSegmentRepository extends JpaRepository<ScriptSegmentEntity, Long> {
}