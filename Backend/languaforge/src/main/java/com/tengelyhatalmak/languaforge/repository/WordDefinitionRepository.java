package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.WordDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WordDefinitionRepository extends JpaRepository<WordDefinition, Integer> {

    Optional<WordDefinition> findByWordIgnoreCaseAndSourceLanguageAndTargetLanguage(String word, String sourceLanguage, String targetLanguage);

    @Query("SELECT wd FROM WordDefinition wd WHERE LOWER(wd.word) IN :words " +
            "AND wd.sourceLanguage = :sourceLang AND wd.targetLanguage = :targetLang")
    List<WordDefinition> findAllByWordsAndLanguages(
            @Param("words") List<String> words,
            @Param("sourceLang") String sourceLanguage,
            @Param("targetLang") String targetLanguage);


}
