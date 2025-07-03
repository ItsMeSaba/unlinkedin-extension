import { defaultFilters } from "../data/default-filters";
import { postDescriptionSelector } from "../data/selectors";
import { getKeywordsByLanguage } from "./get-keywords-by-language";
import { franc } from "franc";
import { languages } from "../data/languages";

/**
 * Analyzes multiple posts using local keyword matching
 * @param {HTMLElement[]} posts - Array of post elements to analyze
 * @returns {Promise<Array<{post: HTMLElement, shouldHide: boolean, category: string}>>}
 */
export async function locallyAnalyzePosts(posts) {
  try {
    // Get both filter and language preferences
    const [
      { filters = defaultFilters },
      { languageFilter = { enabled: false, languages: {} } },
    ] = await Promise.all([
      chrome.storage.sync.get("filters"),
      chrome.storage.sync.get("languageFilter"),
    ]);

    // Extract text content and analyze each post
    return posts.map((post) => {
      const descriptionDiv = post.querySelector(postDescriptionSelector);
      const postText = (descriptionDiv?.innerText || "").toLowerCase();

      // If language filter is enabled, check if post language is allowed
      if (
        languageFilter.enabled &&
        Object.keys(languageFilter.languages).length > 0
      ) {
        const detectedLang = franc(postText);

        // If language is detected and it's in our list
        if (
          detectedLang &&
          detectedLang !== "und" &&
          !!languages[detectedLang]
        ) {
          // If language is not in selected languages or is disabled, hide the post
          if (
            !languageFilter.languages[detectedLang] ||
            languageFilter.languages[detectedLang] === false
          ) {
            return {
              post,
              shouldHide: true,
              category: "Language Filter: " + languages[detectedLang],
            };
          }
        }
      }

      // Try to get language-specific keywords first
      const languageKeywords = getKeywordsByLanguage(postText);

      if (!languageKeywords) {
        return {
          post,
          shouldHide: false,
          category: null,
        };
      }

      // Check each category's keywords if the filter is enabled
      for (const [category, keywords] of Object.entries(languageKeywords)) {
        if (filters[category]?.enabled === false) continue;

        // let matchedKeyword = null;
        const matches = keywords.some((keyword) => {
          const result = postText.includes(keyword.toLowerCase());

          if (result) {
            matchedKeyword = keyword;
          }

          return result;
        });

        if (matches) {
          return {
            post,
            shouldHide: true,
            // category: `${category} - "${matchedKeyword}"`,
            category,
          };
        }
      }

      return {
        post,
        shouldHide: false,
        category: null,
      };
    });
  } catch (error) {
    console.error("Error analyzing posts locally:", error);

    // In case of error, don't hide any posts
    return posts.map((post) => ({
      post,
      shouldHide: false,
      category: null,
    }));
  }
}
