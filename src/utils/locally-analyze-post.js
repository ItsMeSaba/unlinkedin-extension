import { defaultFilters } from "../data/default-filters";
import { postDescriptionSelector } from "../data/selectors";
import { getKeywordsByLanguage } from "./get-keywords-by-language";

/**
 * Analyzes multiple posts using local keyword matching
 * @param {HTMLElement[]} posts - Array of post elements to analyze
 * @returns {Promise<Array<{post: HTMLElement, shouldHide: boolean, category: string}>>}
 */
export async function locallyAnalyzePosts(posts) {
  try {
    const { filters = defaultFilters } = await chrome.storage.sync.get(
      "filters"
    );

    // Extract text content and analyze each post
    return posts.map((post) => {
      const descriptionDiv = post.querySelector(postDescriptionSelector);
      const postText = (descriptionDiv?.innerText || "").toLowerCase();

      // Try to get language-specific keywords first
      const languageKeywords = getKeywordsByLanguage(postText);

      console.log("languageKeywords", languageKeywords);

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

        const matches = keywords.some((keyword) =>
          postText.includes(keyword.toLowerCase())
        );

        if (matches) {
          return {
            post,
            shouldHide: true,
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
