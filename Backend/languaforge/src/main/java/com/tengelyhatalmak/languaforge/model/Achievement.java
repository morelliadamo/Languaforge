package com.tengelyhatalmak.languaforge.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.lettuce.core.json.JsonObject;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bouncycastle.util.Times;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "achievement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {


    @OneToMany(mappedBy = "achievement", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserXAchievement> usersOfAchievement = new ArrayList<>();


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "earn_condition", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private AchievementEarnCondition earnCondition;

    @Column(name = "icon_url", nullable = false)
    private String iconUrl;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;



    @PrePersist
    protected void onCreate() {
        createdAt = Timestamp.valueOf(LocalDateTime.now());

        if (isDeleted == null){
            isDeleted = false;
        }

    }

}
