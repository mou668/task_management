package com.example.demo.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.User;
import com.example.demo.service.FileStorageService;
import com.example.demo.service.UserService;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5174")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private FileStorageService fileService;


    @PostMapping
    public User createUser(@RequestBody User user)
    {
        return userService.saveUser(user);
    }

    @GetMapping
    public List<User> getUsers()
    {
        return userService.getUsers();
    }
    @PostMapping("/upload-profile")
    public String uploadProfilePhoto(@RequestParam("file") MultipartFile file) throws Exception {
        return fileService.saveProfilePhoto(file);
    }




    

}

