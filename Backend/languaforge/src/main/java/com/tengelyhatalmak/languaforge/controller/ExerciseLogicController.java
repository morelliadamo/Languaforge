package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.service.ExerciseLogicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exerciseLogic")
public class ExerciseLogicController {

    @Autowired
    private ExerciseLogicService exerciseLogicService;

    @Autowired
    private RestTemplate restTemplate;

    private static final String FASTAPI_URL = "http://localhost:8000/transcribe";

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluatePronunciation(
            @RequestParam String expectedText,
            @RequestPart MultipartFile audioFile) throws IOException {

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(audioFile.getBytes()) {
            @Override
            public String getFilename() {
                return audioFile.getOriginalFilename();
            }
        });
        body.add("expected", expectedText);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        Map<String, Object> transcriptionResult = restTemplate.postForObject(
                FASTAPI_URL,
                request,
                Map.class);

        List<Map<String, Object>> wordMaps = (List<Map<String, Object>>) transcriptionResult.get("words");
        List<ExerciseLogicService.WordInfo> words = wordMaps.stream()
                .map(w -> new ExerciseLogicService.WordInfo(
                        (String) w.get("text"),
                        ((Number) w.get("start")).doubleValue(),
                        ((Number) w.get("end")).doubleValue(),
                        null))
                .toList();

        String transcript = (String) transcriptionResult.get("text");

        ExerciseLogicService.PronounciationResult result =
                exerciseLogicService.evaluatePronounciation(expectedText, transcript, words);

        String feedback = exerciseLogicService.generateFeedback(result);

        return ResponseEntity.ok(Map.of(
                "transcript", transcript,
                "words", words,
                "evaluation", result,
                "feedback", feedback,
                "language", transcriptionResult.get("language")));
    }

}
