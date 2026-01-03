package com.preppath.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "syllabus_sections")
public class SyllabusSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer completed = 0;

    @Column(name = "total_topics")
    private Integer totalTopics;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    
    public SyllabusSection() {}

    public SyllabusSection(String title, Integer totalTopics, User user) {
        this.title = title;
        this.totalTopics = totalTopics;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getCompleted() {
        return completed;
    }

    public void setCompleted(Integer completed) {
        this.completed = completed;
    }

    public Integer getTotalTopics() {
        return totalTopics;
    }

    public void setTotalTopics(Integer totalTopics) {
        this.totalTopics = totalTopics;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}