package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Document;

public interface DocumentRepository extends JpaRepository<Document,Long>{
	List<Document> findByTaskId(Long taskId);

}
