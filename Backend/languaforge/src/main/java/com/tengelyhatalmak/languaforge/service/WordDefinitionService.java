package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.WordDefinition;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;


public interface WordDefinitionService {

    Optional<WordDefinition> findDefinition(String word, String sourceLang, String targetLang);

    Map<String, WordDefinition> findDefinitions(List<String> words, String sourceLang, String targetLang);

    WordDefinition saveWordDefinition(WordDefinition wordDefinition);

    List<WordDefinition> saveAll(List<WordDefinition> definitions);
}
