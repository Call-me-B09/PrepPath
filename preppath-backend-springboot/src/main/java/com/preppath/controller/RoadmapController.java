package com.preppath.controller;

import com.preppath.model.Roadmap;
import com.preppath.service.GeminiService;
import com.preppath.service.PDFService;
import com.preppath.service.RoadmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {
    
    @Autowired
    private RoadmapService roadmapService;
 
    @Autowired
    private PDFService pdfService;

    @Autowired
    private GeminiService geminiService;
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> createRoadmap(
            @PathVariable Long userId,
            @RequestBody Roadmap roadmap) {
        try {
            Map<String, Object> result = roadmapService.createRoadmap(userId, roadmap);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getRoadmap(@PathVariable Long userId) {
        try {
            Roadmap roadmap = roadmapService.getRoadmap(userId);
            return ResponseEntity.ok(roadmap);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteRoadmap(@PathVariable Long userId) {
        try {
            roadmapService.deleteRoadmap(userId);
            return ResponseEntity.ok(Map.of("message", "Roadmap deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/create-from-pdfs/{userId}", consumes = "multipart/form-data")
    public ResponseEntity<?> createRoadmapFromPDFs(
            @PathVariable Long userId,
            @RequestParam("syllabusPdf") MultipartFile syllabusPdf,
            @RequestParam("pyqsPdf") MultipartFile pyqsPdf,
            @RequestParam("examName") String examName,
            @RequestParam("examDate") String examDate) {
        
        System.out.println("=== PDF Upload Debug ===");
        System.out.println("User ID: " + userId);
        System.out.println("Syllabus PDF: " + (syllabusPdf != null ? syllabusPdf.getOriginalFilename() : "null"));
        System.out.println("PYQs PDF: " + (pyqsPdf != null ? pyqsPdf.getOriginalFilename() : "null"));
        System.out.println("Exam Name: " + examName);
        System.out.println("Exam Date: " + examDate);
        try {
          
            System.out.println("Extracting text from PDFs...");
            String syllabusText = pdfService.extractTextFromPDF(syllabusPdf);
            String pyqsText = pdfService.extractTextFromPDF(pyqsPdf);
            
            System.out.println("Syllabus text length: " + syllabusText.length());
            System.out.println("PYQs text length: " + pyqsText.length());
            
            
            String prompt = String.format(
                "Create a 8-week study plan for %s exam on %s. " +
                "Syllabus highlights: %s. " +
                "PYQs show: %s. " +
                "Give JSON with weekly topics and 5 tasks.",
                examName, examDate,
                syllabusText.substring(0, Math.min(2000, syllabusText.length())),
                pyqsText.substring(0, Math.min(1000, pyqsText.length()))
            );
            
            System.out.println("Prompt created, calling Gemini...");
            
           
            String aiResponse = geminiService.callGemini(prompt);
            
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("examName", examName);
            response.put("examDate", examDate);
            response.put("aiPlan", aiResponse);
            response.put("message", "AI roadmap generated from your PDFs!");
            
            System.out.println("Success! Returning response...");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("ERROR in PDF upload: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            error.put("fallback", "Use manual roadmap creation");
            return ResponseEntity.ok(error);
        }
    }
    @GetMapping("/test-ai")
    public String testAI() {
        return geminiService.callGemini("Hello");
    }
    @PostMapping("/test-upload")
    public ResponseEntity<?> testUpload(
            @RequestParam("testFile") MultipartFile testFile,
            @RequestParam("testText") String testText) {
        
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("fileName", testFile.getOriginalFilename());
            response.put("fileSize", testFile.getSize());
            response.put("testText", testText);
            response.put("message", "File upload test successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("cause", e.getCause() != null ? e.getCause().getMessage() : "Unknown");
            return ResponseEntity.badRequest().body(error);
        }
    }
}