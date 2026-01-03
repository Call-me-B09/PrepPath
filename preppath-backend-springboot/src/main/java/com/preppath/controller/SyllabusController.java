package com.preppath.controller;

import com.preppath.model.SyllabusSection;
import com.preppath.service.SyllabusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/syllabus")
@CrossOrigin(origins = "*")
public class SyllabusController {
    
    @Autowired
    private SyllabusService syllabusService;
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> createSection(
            @PathVariable Long userId,
            @RequestBody SyllabusSection section) {
        try {
            SyllabusSection createdSection = syllabusService.createSection(userId, section);
            return ResponseEntity.ok(createdSection);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserSections(@PathVariable Long userId) {
        try {
            List<SyllabusSection> sections = syllabusService.getUserSections(userId);
            return ResponseEntity.ok(sections);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{sectionId}/progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable Long sectionId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer progress = request.get("progress");
            if (progress == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Progress value required"));
            }
            
            SyllabusSection section = syllabusService.updateProgress(sectionId, progress);
            return ResponseEntity.ok(section);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}