package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Document;
import com.example.demo.entity.Task;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.repository.TaskRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private TaskRepository taskRepository;

    public Document saveDocument(Document doc, Long taskId){

        Task task = taskRepository.findById(taskId).orElse(null);

        doc.setTask(task);

        return documentRepository.save(doc);
    }
    public java.util.List<Document> getDocumentsByTaskId(Long taskId) {
        return documentRepository.findByTaskId(taskId);
    }

}
