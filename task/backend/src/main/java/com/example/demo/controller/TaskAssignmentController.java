package com.example.demo.controller;

import com.example.demo.entity.TaskAssignment;
import com.example.demo.service.TaskAssignmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class TaskAssignmentController {

    @Autowired
    private TaskAssignmentService service;

    // Assign Task
    @PostMapping
    public TaskAssignment assignTask(@RequestBody TaskAssignment assignment) {
        return service.assignTask(assignment);
    }

    // Get All Assignments
    @GetMapping
    public List<TaskAssignment> getAssignments() {
        return service.getAllAssignments();
    }

    // Delete Assignment
    @DeleteMapping("/{id}")
    public String deleteAssignment(@PathVariable Long id) {
        service.deleteAssignment(id);
        return "Assignment deleted successfully";
    }
}
