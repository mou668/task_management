package com.example.demo.dto;

public class DashboardDTO {

    private long totalTasks;
    private long completed;
    private long pending;
    private long inProgress;

    public DashboardDTO(long totalTasks, long completed, long pending, long inProgress) {
        this.totalTasks = totalTasks;
        this.completed = completed;
        this.pending = pending;
        this.inProgress = inProgress;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public long getCompleted() {
        return completed;
    }

    public long getPending() {
        return pending;
    }

    public long getInProgress() {
        return inProgress;
    }
}
