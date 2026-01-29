package com.tengelyhatalmak.languaforge.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false, insertable = false, updatable = false)
    @JsonBackReference
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("user-userxcourse")
    private List<UserXCourse> userXCourses = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserXAchievement> achievementsOfUser = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<Score> scores = new ArrayList<>();

    public void addScore(Score score){
        this.scores.add(score);
        score.setUser(this);
    }

    public void removeScore(Score score){
        this.scores.remove(score);
        score.setUser(null);
    }


    @Column(name = "role_id", nullable = false)
    private Integer roleId = 1;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "last_login")
    private Timestamp lastLogin;

    @Column(name = "activation_token")
    private String activationToken;

    @Column(name = "is_active")
    private Boolean isActive = false;


    @Column(name = "is_anonymized", nullable = false)
    private boolean isAnonymized = false;

    @Column(name = "anonymized_at")
    private Timestamp anonymizedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    public User(String username, String email, String passwordHash, Integer roleId, Timestamp createdAt, Timestamp lastLogin, Boolean isAnonymized, Timestamp anonymizedAt, Boolean isDeleted, Timestamp deletedAt) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.roleId = (roleId != null) ? roleId : 1;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.isAnonymized = (isAnonymized != null) ? isAnonymized : Boolean.FALSE;
        this.anonymizedAt = anonymizedAt;
        this.isDeleted = (isDeleted != null) ? isDeleted : Boolean.FALSE;
        this.deletedAt = deletedAt;
    }

}
