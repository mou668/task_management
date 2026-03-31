package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskAssignment;
import com.example.demo.service.TaskService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Create Task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // Get All Tasks
    @GetMapping
    public List<Task> getTasks() {
        return taskService.getTasks();
    }

    // UPDATE TASK (THIS FIXES YOUR ERROR)
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }
    
    @GetMapping("/user/{userId}")
    public List<TaskAssignment> getTasksByUser(@PathVariable Long userId) {
        return taskService.getTasksByUser(userId);
    }
    
    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable String status){
        return taskService.getTasksByStatus(status);
    }
    
    @GetMapping("/dashboard")
    public DashboardDTO getDashboard(){
        return taskService.getDashboardStats();
    }
    
    @GetMapping("/date/{date}")
    public List<Task> getTasksByDate(@PathVariable String date) {
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        return taskService.getTasks().stream()
                .filter(t -> localDate.equals(t.getDueDate()))
                .toList();
    }
    
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        // Assume taskService has delete logic or just use repo if needed. We will check taskService next.
        taskService.deleteTask(id);
        return "Task deleted successfully";
    }
}
