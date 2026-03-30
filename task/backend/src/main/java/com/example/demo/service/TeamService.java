package com.example.demo.service;

import com.example.demo.entity.Team;
import com.example.demo.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    // Create Team
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    // Get All Teams
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    // Get Team By ID
    public Team getTeamById(Long id) {
        return teamRepository.findById(id).orElse(null);
    }

    // Delete Team
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
