package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.WordDefinition;
import com.tengelyhatalmak.languaforge.repository.WordDefinitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.lang.Override;

@Service
public class WordDefinitionServiceImpl implements WordDefinitionService {
    @Autowired
    private WordDefinitionRepository wordDefinitionRepository;

    @Override
    public Optional<WordDefinition> findDefinition(String word, String sourceLang, String targetLang) {
        return wordDefinitionRepository
                .findByWordIgnoreCaseAndSourceLanguageAndTargetLanguage(word, sourceLang, targetLang);
    }

    @Override
    public Map<String, WordDefinition> findDefinitions(List<String> words, String sourceLang, String targetLang) {
        List<String> lowerWords = words.stream()
                .map(String::toLowerCase)
                .distinct()
                .collect(Collectors.toList());

        List<WordDefinition> results = wordDefinitionRepository
                .findAllByWordsAndLanguages(lowerWords, sourceLang, targetLang);

        return results.stream()
                .collect(Collectors.toMap(
                        wd -> wd.getWord().toLowerCase(),
                        wd -> wd,
                        (a, b) -> a
                ));
    }

    @Override
    public WordDefinition saveWordDefinition(WordDefinition wordDefinition) {
        return wordDefinitionRepository.save(wordDefinition);
    }

    @Override
    public List<WordDefinition> saveAll(List<WordDefinition> definitions) {
        return wordDefinitionRepository.saveAll(definitions);
    }

}
