package com.preppath.service;

import com.preppath.model.SyllabusSection;
import com.preppath.model.User;
import com.preppath.repository.SyllabusRepository;
import com.preppath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SyllabusService {
    
    @Autowired
    private SyllabusRepository syllabusRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public SyllabusSection createSection(Long userId, SyllabusSection section) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        section.setUser(user);
        return syllabusRepository.save(section);
    }
    
    public List<SyllabusSection> getUserSections(Long userId) {
        return syllabusRepository.findByUserId(userId);
    }
    
    public SyllabusSection updateProgress(Long sectionId, Integer progress) {
        SyllabusSection section = syllabusRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));
        
        if (progress < 0 || progress > 100) {
            throw new RuntimeException("Progress must be between 0 and 100");
        }
        
        section.setCompleted(progress);
        return syllabusRepository.save(section);
    }
    
    public double getOverallProgress(Long userId) {
        List<SyllabusSection> sections = syllabusRepository.findByUserId(userId);
        if (sections.isEmpty()) {
            return 0;
        }
        
        double totalProgress = sections.stream()
            .mapToDouble(SyllabusSection::getCompleted)
            .sum();
        
        return totalProgress / sections.size();
    }
}