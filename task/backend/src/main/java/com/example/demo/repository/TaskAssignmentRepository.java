package com.example.demo.repository;

import com.example.demo.entity.TaskAssignment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
	 List<TaskAssignment> findByUserId(Long userId);
}
