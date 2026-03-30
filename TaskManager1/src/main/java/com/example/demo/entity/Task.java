package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private int progress;

    private String status;

    private LocalDate dueDate;

    public Task(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public String getTitle(){return title;}
    public void setTitle(String title){this.title=title;}

    public String getDescription(){return description;}
    public void setDescription(String description){this.description=description;}

    public int getProgress(){return progress;}
    public void setProgress(int progress){this.progress=progress;}

    public String getStatus(){return status;}
    public void setStatus(String status){this.status=status;}

    public LocalDate getDueDate(){return dueDate;}
    public void setDueDate(LocalDate dueDate){this.dueDate=dueDate;}
}
