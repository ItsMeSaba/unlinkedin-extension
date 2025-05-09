import { franc } from "franc";
import { keywordsByLanguages } from "../data/filtration-keywords/keywords-by-languages";

/**
 * Get keywords for a specific language based on post text
 * @param {string} text - The post text to analyze
 * @returns {Object|null} Keywords object for the detected language or null if language not supported
 */
export function getKeywordsByLanguage(text) {
  try {
    // Detect language using franc
    const detectedLang = franc(text);

    console.log("detectedLang", detectedLang);

    // If language detection failed or returned 'und' (undefined)
    if (!detectedLang || detectedLang === "und") {
      return null;
    }

    // Check if we have keywords for this language
    if (keywordsByLanguages[detectedLang]) {
      return keywordsByLanguages[detectedLang];
    }

    // If language not supported, return null
    return null;
  } catch (error) {
    console.error("Error detecting language:", error);
    return null;
  }
}
