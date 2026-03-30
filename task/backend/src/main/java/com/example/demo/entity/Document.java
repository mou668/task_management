package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name="documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    private String fileType;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;

    public Document(){}

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

    public String getFileName(){return fileName;}
    public void setFileName(String fileName){this.fileName=fileName;}

    public String getFilePath(){return filePath;}
    public void setFilePath(String filePath){this.filePath=filePath;}

    public String getFileType(){return fileType;}
    public void setFileType(String fileType){this.fileType=fileType;}

    public Task getTask(){return task;}
    public void setTask(Task task){this.task=task;}
}
