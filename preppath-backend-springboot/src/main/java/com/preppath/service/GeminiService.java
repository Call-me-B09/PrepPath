package com.preppath.service;

import org.springframework.stereotype.Service;

@Service
public class GeminiService {
    
    public String callGemini(String prompt) {

        return """
            {
              "success": true,
              "aiResponse": "Based on your uploaded syllabus and PYQs, I've created a 10-week study plan focusing on high-weightage topics. Week 1-2: Core concepts, Week 3-6: Advanced topics, Week 7-8: Revision, Week 9-10: Mock tests.",
              "topics": ["Electrostatics", "Organic Chemistry", "Calculus", "Mechanics"],
              "weeklyHours": 20,
              "totalWeeks": 10
            }
            """;
    }
    
    public String generateMockRoadmap(String examName, String examDate) {
        return String.format("""
            {
              "exam": "%s",
              "date": "%s",
              "plan": "AI-generated 8-week roadmap",
              "status": "ready"
            }
            """, examName, examDate);
    }
}