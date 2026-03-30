package com.example.demo.service;
import com.example.demo.dto.DashboardDTO;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Task;
import com.example.demo.entity.TaskAssignment;
import com.example.demo.repository.TaskAssignmentRepository;
import com.example.demo.repository.TaskRepository;

@Service
public class TaskService {

	@Autowired
    private TaskRepository taskRepository;
	@Autowired
	private TaskAssignmentRepository assignmentRepository;


    public Task createTask(Task task){
        return taskRepository.save(task);
    }

    public List<Task> getTasks(){
        return taskRepository.findAll();
    }
    public Task updateTask(Long id, Task taskDetails) {

        Task task = taskRepository.findById(id).orElse(null);

        if(task != null){
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setStatus(taskDetails.getStatus());
            task.setProgress(taskDetails.getProgress());

            return taskRepository.save(task);
        }

        return null;
    }
    public List<TaskAssignment> getTasksByUser(Long userId) {
        return assignmentRepository.findByUserId(userId);
    }
    public List<Task> getTasksByStatus(String status){
        return taskRepository.findByStatus(status);
    }
    public DashboardDTO getDashboardStats(){

        long total = taskRepository.count();
        long completed = taskRepository.countByStatus("COMPLETED");
        long pending = taskRepository.countByStatus("PENDING");
        long progress = taskRepository.countByStatus("IN_PROGRESS");

        return new DashboardDTO(total, completed, pending, progress);
    }
    
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }


}
