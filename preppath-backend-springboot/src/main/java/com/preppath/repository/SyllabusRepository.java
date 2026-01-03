package com.preppath.repository;

import com.preppath.model.SyllabusSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusRepository extends JpaRepository<SyllabusSection, Long> {
    List<SyllabusSection> findByUserId(Long userId);
}