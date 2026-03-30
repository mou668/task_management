package com.example.demo.service;

import java.io.File;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String DOC_DIR = System.getProperty("user.dir") + "/uploads/documents/";

    public String saveDocument(MultipartFile file) throws Exception {

        // ✅ Create directory if not exists
        File directory = new File(DOC_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = file.getOriginalFilename();

        File dest = new File(DOC_DIR + fileName);

        file.transferTo(dest);

        return DOC_DIR + fileName;
    }
    public String saveProfilePhoto(MultipartFile file) throws Exception {

        String uploadDir = "C:/uploads/profile_photos/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        File destination = new File(uploadDir + fileName);
        file.transferTo(destination);

        return fileName;
    }

}
