package com.tengelyhatalmak.languaforge.service;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ExerciseLogicService {

    @AllArgsConstructor
    @Getter
    @Setter
    public static class WordInfo{
        public String word;
        public Double start;
        public Double end;
        public Double confidence;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class Op{
        public String op;
        public String expected;
        public String actual;
    }

    @AllArgsConstructor
    @Getter
    @Setter
    public static class PronounciationResult{
        public Integer expectedWordCount;
        public Integer matches;
        public Double accuracy;
        public List<Op> ops;
    }

    private List<String> tokenize(String text) {
        if (text == null || text.isEmpty()) return new ArrayList<>();
        String normalized = text.toLowerCase().replaceAll("[^a-z0-9'\\s]+", " ");
        String[] parts = normalized.trim().split("\\s+");
        return new ArrayList<>(Arrays.asList(parts));
    }

    private PronounciationResult alignWords(List<String> expectedWords, List<String> actualWords) {
        int m = expectedWords.size();
        int n = actualWords.size();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) dp[i][0] = i;
        for (int j = 1; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int cost = expectedWords.get(i - 1).equals(actualWords.get(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), dp[i - 1][j - 1] + cost);
            }
        }
        int i = m, j = n;
        List<Op> ops = new ArrayList<>();
        int matches = 0;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && expectedWords.get(i - 1).equals(actualWords.get(j - 1)) && dp[i][j] == dp[i - 1][j - 1]) {
                ops.add(0, new Op("match", expectedWords.get(i - 1), actualWords.get(j - 1)));
                matches++;
                i--; j--;
            } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) {
                ops.add(0, new Op("sub", expectedWords.get(i - 1), actualWords.get(j - 1)));
                i--; j--;
            } else if (i > 0 && dp[i][j] == dp[i - 1][j] + 1) {
                ops.add(0, new Op("del", expectedWords.get(i - 1), null));
                i--;
            } else {
                ops.add(0, new Op("ins", null, actualWords.get(j - 1)));
                j--;
            }
        }
        double accuracy = (m > 0) ? ((double) matches) / m : 0.0;
        return new PronounciationResult(m, matches, accuracy, ops);
    }

    public PronounciationResult evaluatePronounciation(String expectedText, String transcript, List<WordInfo> words){

        List<String> expectedWords = tokenize(expectedText);
        List<String> actualWords = new ArrayList<>();

        for(WordInfo wordInfo : words){
            actualWords.add(wordInfo.word.toLowerCase());
        }

        return alignWords(expectedWords, actualWords);
    }


    public String generateFeedback(PronounciationResult result) {
        if (result.expectedWordCount == 0) return "No expected text provided.";
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Accuracy: %.1f%%. ", result.accuracy * 100));
        int subs = 0, dels = 0, ins = 0;
        for (Op op : result.ops) {
            switch (op.op) {
                case "sub": subs++; break;
                case "del": dels++; break;
                case "ins": ins++; break;
            }
        }
        if (subs > 0) sb.append(subs).append(" substitution(s). ");
        if (dels > 0) sb.append(dels).append(" missing word(s). ");
        if (ins > 0) sb.append(ins).append(" extra word(s). ");
        if (result.accuracy > 0.9) sb.append("Good pronunciation overall.");
        else if (result.accuracy > 0.7) sb.append("Some words need improvement; focus on stressed syllables.");
        else sb.append("Work on word-by-word clarity and practice slowly.");
        return sb.toString();
    }
}
