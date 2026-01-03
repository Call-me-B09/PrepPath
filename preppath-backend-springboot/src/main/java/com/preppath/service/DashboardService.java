package com.preppath.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private SyllabusService syllabusService;
    
    @Autowired
    private UserService userService;
    
    public Map<String, Object> getDashboardSummary(Long userId) {
        Map<String, Object> summary = new HashMap<>();
        
       
        long totalTasks = taskService.getTotalTasksCount(userId);
        long completedTasks = taskService.getCompletedTasksCount(userId);
        
        
        double overallProgress = syllabusService.getOverallProgress(userId);
        
        
        var user = userService.getUserProfile(userId);
        
        
        long daysLeft = 0;
        if (user.getExamDate() != null && !user.getExamDate().isEmpty()) {
            LocalDate examDate = LocalDate.parse(user.getExamDate());
            daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), examDate);
            if (daysLeft < 0) daysLeft = 0;
        }
        
        
        var tasks = taskService.getUserTasks(userId);
        long totalStudyMinutes = tasks.stream()
            .mapToLong(task -> task.getDurationMinutes() != null ? task.getDurationMinutes() : 0)
            .sum();
        long totalStudyHours = totalStudyMinutes / 60;
        
        summary.put("totalTasks", totalTasks);
        summary.put("completedTasks", completedTasks);
        summary.put("totalStudyHours", totalStudyHours);
        summary.put("overallProgress", overallProgress);
        summary.put("daysLeft", daysLeft);
        summary.put("examName", user.getExamName());
        summary.put("hasRoadmap", user.isHasRoadmap());
        
        return summary;
    }
}