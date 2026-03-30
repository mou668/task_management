package com.example.demo.controller;

import com.example.demo.entity.Team;
import com.example.demo.service.TeamService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5174")
public class TeamController {

    @Autowired
    private TeamService teamService;

    // Create Team
    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    // Get All Teams
    @GetMapping
    public List<Team> getTeams() {
        return teamService.getAllTeams();
    }

    // Get Team By ID
    @GetMapping("/{id}")
    public Team getTeam(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    // Delete Team
    @DeleteMapping("/{id}")
    public String deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return "Team deleted successfully";
    }
    
}
