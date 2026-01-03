package com.preppath.service;

import com.preppath.model.User;
import com.preppath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
      
        
        
        User savedUser = userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", savedUser);
        response.put("message", "Registration successful");
        return response;
    }
    
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
 
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("message", "Login successful");
        return response;
    }
}