package com.preppath.service;

import com.preppath.model.Roadmap;
import com.preppath.model.User;
import com.preppath.repository.RoadmapRepository;
import com.preppath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RoadmapService {
    
    @Autowired
    private RoadmapRepository roadmapRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> createRoadmap(Long userId, Roadmap roadmap) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        
        if (roadmapRepository.existsByUserId(userId)) {
            throw new RuntimeException("User already has a roadmap");
        }
        
        roadmap.setUser(user);
        Roadmap savedRoadmap = roadmapRepository.save(roadmap);
        
   
        user.setHasRoadmap(true);
        user.setExamName(roadmap.getExamType());
        user.setExamDate(roadmap.getTargetDate());
        userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("roadmap", savedRoadmap);
        response.put("message", "Roadmap created successfully");
        return response;
    }
    
    public Roadmap getRoadmap(Long userId) {
        return roadmapRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Roadmap not found"));
    }
    
    public void deleteRoadmap(Long userId) {
        Roadmap roadmap = roadmapRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Roadmap not found"));
        
        roadmapRepository.delete(roadmap);
        
        
        User user = userRepository.findById(userId).orElseThrow();
        user.setHasRoadmap(false);
        user.setExamName(null);
        user.setExamDate(null);
        userRepository.save(user);
    }
}