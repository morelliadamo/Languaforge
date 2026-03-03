package com.tengelyhatalmak.languaforge.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Getter
@Setter
public class WordDefinitionBulkLookupDTO {
        private List<String> words;
        private String sourceLanguage;
        private String targetLanguage;
}
