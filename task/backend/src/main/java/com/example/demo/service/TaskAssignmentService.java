package com.example.demo.service;

import com.example.demo.entity.TaskAssignment;
import com.example.demo.repository.TaskAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskAssignmentService {

    @Autowired
    private TaskAssignmentRepository repository;

    public TaskAssignment assignTask(TaskAssignment assignment) {
        return repository.save(assignment);
    }

    public List<TaskAssignment> getAllAssignments() {
        return repository.findAll();
    }

    public void deleteAssignment(Long id) {
        repository.deleteById(id);
    }
}
