package com.example.demo.service;

import java.io.File;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String DOC_DIR="uploads/documents/";

    public String saveDocument(MultipartFile file) throws Exception{

        String fileName=file.getOriginalFilename();

        File dest=new File(DOC_DIR+fileName);
        
        // Ensure the directory exists
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }

        file.transferTo(dest);

        return DOC_DIR+fileName;
    }
}
