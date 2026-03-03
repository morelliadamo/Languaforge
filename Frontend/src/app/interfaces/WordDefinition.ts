export interface WordDefinition {
  id: number;
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  definition: string;
  exampleSentence: string | null;
}
