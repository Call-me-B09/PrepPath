package com.preppath.service;

import com.preppath.model.User;
import com.preppath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUserProfile(Long userId, User updatedUser) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getAvatarUrl() != null) {
            user.setAvatarUrl(updatedUser.getAvatarUrl());
        }
        
        return userRepository.save(user);
    }
}