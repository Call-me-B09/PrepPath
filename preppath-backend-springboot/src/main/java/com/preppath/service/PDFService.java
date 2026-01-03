package com.preppath.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

@Service
public class PDFService {
    
    public String extractTextFromPDF(MultipartFile pdfFile) {
        try (InputStream inputStream = pdfFile.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {
            
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse PDF: " + e.getMessage());
        }
    }
}