package com.preppath.service;

import com.preppath.model.Task;
import com.preppath.model.User;
import com.preppath.repository.TaskRepository;
import com.preppath.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Task createTask(Long userId, Task task) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        task.setUser(user);
        return taskRepository.save(task);
    }
    
    public List<Task> getUserTasks(Long userId) {
        return taskRepository.findByUserId(userId);
    }
    
    public Task updateTask(Long taskId, Task updatedTask) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (updatedTask.getTitle() != null) {
            task.setTitle(updatedTask.getTitle());
        }
        if (updatedTask.getDurationMinutes() != null) {
            task.setDurationMinutes(updatedTask.getDurationMinutes());
        }
        task.setCompleted(updatedTask.isCompleted());
        
        return taskRepository.save(task);
    }
    
    public Task toggleTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }
    
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        taskRepository.delete(task);
    }
    
    public long getCompletedTasksCount(Long userId) {
        return taskRepository.countByUserIdAndCompleted(userId, true);
    }
    
    public long getTotalTasksCount(Long userId) {
        return taskRepository.findByUserId(userId).size();
    }
}