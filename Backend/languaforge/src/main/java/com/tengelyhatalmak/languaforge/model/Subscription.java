package com.tengelyhatalmak.languaforge.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bouncycastle.util.Times;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import static org.hibernate.resource.beans.internal.Helper.getBean;

@Entity
@Table(name = "subscription")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true, updatable = false)
    @JsonIgnoreProperties({"leaderboardList", "scores", "reviews", "achievementsOfUser", "userXCourses", "loginDataList", "lessonProgresses", "streak"})
    private User user;

    @Column(name = "user_id", nullable = false, insertable = false, updatable = false)
    private Integer userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pricing_id")
    @JsonIgnoreProperties({"subscriptions", "course"})
    private Pricing pricing;

    @Column(name = "pricing_id", nullable = false, insertable = false, updatable = false)
    private Integer pricingId;


    public enum Status{
        active,
        canceled,
        expired
    }

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.active;

    @Column(name =  "start_date")
    private Timestamp startDate = Timestamp.valueOf(LocalDateTime.now());

    @Column(name = "end_date")
    private Timestamp endDate;

    @Column(name = "auto_renew")
    private Boolean autoRenew = true;

    @Column(name = "created_at")
    private Timestamp createdAt = Timestamp.valueOf(LocalDateTime.now());

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    @PrePersist
    protected void onCreate() {

        createdAt = Timestamp.valueOf(LocalDateTime.now());
        if (status == null) {
            status = Status.active;
        }
        if (autoRenew == null) {
            autoRenew = true;
        }
        if (isDeleted == null) {
            isDeleted = false;
        }

    }


}
