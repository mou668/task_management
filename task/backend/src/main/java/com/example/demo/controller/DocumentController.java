package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Document;
import com.example.demo.service.DocumentService;
import com.example.demo.service.FileStorageService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private FileStorageService fileService;

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload/{taskId}")
    public Document uploadFile(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String path = fileService.saveDocument(file);

        Document doc = new Document();

        doc.setFileName(file.getOriginalFilename());
        doc.setFilePath(path);
        doc.setFileType(file.getContentType());

        return documentService.saveDocument(doc,taskId);
    }

    @org.springframework.web.bind.annotation.GetMapping("/task/{taskId}")
    public java.util.List<Document> getDocumentsByTask(@PathVariable Long taskId) {
        return documentService.getDocumentsByTaskId(taskId);
    }
}
