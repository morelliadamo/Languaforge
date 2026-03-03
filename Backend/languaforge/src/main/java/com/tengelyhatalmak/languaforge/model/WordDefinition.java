package com.tengelyhatalmak.languaforge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "word_definition", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"word", "source_language", "target_language"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WordDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "word", nullable = false)
    private String word;

    @Column(name = "source_language", nullable = false)
    private String sourceLanguage;

    @Column(name = "target_language", nullable = false)
    private String targetLanguage;

    @Column(name = "definition", nullable = false)
    private String definition;

    @Column(name = "example_sentence")
    private String exampleSentence;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Timestamp.valueOf(LocalDateTime.now());
        }
    }
}