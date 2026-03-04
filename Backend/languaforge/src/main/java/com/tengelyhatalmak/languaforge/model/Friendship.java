package com.tengelyhatalmak.languaforge.model;


import jakarta.persistence.*;
import lombok.*;

import javax.management.ConstructorParameters;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "friendship")
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "user1_id", nullable = false)
    private Integer user1Id;

    @Column(name = "user2_id", nullable = false)
    private Integer user2Id;

    public enum FriendshipStatus {
        pending,
        accepted,
        rejected
    }

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private FriendshipStatus status = FriendshipStatus.pending;

    @Column(name = "created_at")
    private Timestamp createdAt;


    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Timestamp.valueOf(LocalDateTime.now());
        }
        if (isDeleted == null) {
            isDeleted = false;
        }
        if (status == null) {
            status = FriendshipStatus.pending;
        }
    }


}
