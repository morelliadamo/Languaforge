package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.dto.WordDefinitionBulkLookupDTO;
import com.tengelyhatalmak.languaforge.model.WordDefinition;
import com.tengelyhatalmak.languaforge.service.WordDefinitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wordDefinitions")
public class WordDefinitionController {

    @Autowired
    private WordDefinitionService wordDefinitionService;


    @GetMapping("/lookup")
    public ResponseEntity<WordDefinition> lookupWord(
            @RequestParam String word,
            @RequestParam String source,
            @RequestParam String target) {
        return wordDefinitionService.findDefinition(word, source, target)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/bulk")
    public Map<String, WordDefinition> bulkLookup(@RequestBody WordDefinitionBulkLookupDTO request) {
        return wordDefinitionService.findDefinitions(
                request.getWords(), request.getSourceLanguage(), request.getTargetLanguage());
    }

    @PostMapping("/create")
    public WordDefinition createDefinition(@RequestBody WordDefinition wordDefinition) {
        return wordDefinitionService.saveWordDefinition(wordDefinition);
    }

    @PostMapping("/createBulk")
    public List<WordDefinition> createBulkDefinitions(@RequestBody List<WordDefinition> definitions) {
        return wordDefinitionService.saveAll(definitions);
    }


}
