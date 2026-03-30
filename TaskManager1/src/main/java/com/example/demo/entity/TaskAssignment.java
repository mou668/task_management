package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name="task_assignments")
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    public TaskAssignment(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public Task getTask(){return task;}
    public void setTask(Task task){this.task=task;}

    public User getUser(){return user;}
    public void setUser(User user){this.user=user;}
}
