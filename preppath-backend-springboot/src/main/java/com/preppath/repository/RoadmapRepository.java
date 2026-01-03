package com.preppath.repository;

import com.preppath.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    Optional<Roadmap> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}