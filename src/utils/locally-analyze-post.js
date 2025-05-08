import filtrationKeywords from "../data/filtration-keywords.json";
import { postDescriptionSelector } from "../data/selectors";

/**
 * Analyzes multiple posts using local keyword matching
 * @param {HTMLElement[]} posts - Array of post elements to analyze
 * @returns {Promise<Array<{post: HTMLElement, shouldHide: boolean, category: string}>>}
 */
export async function locallyAnalyzePosts(posts) {
  try {
    // Get filter preferences
    const { filters = {} } = await chrome.storage.sync.get("filters");

    // Extract text content and analyze each post
    return posts.map((post) => {
      const descriptionDiv = post.querySelector(postDescriptionSelector);
      const postText = (descriptionDiv?.innerText || "").toLowerCase();

      // Check each category's keywords if the filter is enabled
      for (const [category, keywords] of Object.entries(filtrationKeywords)) {
        // Skip if this filter is disabled
        if (filters[category]?.enabled === false) continue;

        // Check if any keyword matches
        const matches = keywords.some((keyword) =>
          postText.includes(keyword.toLowerCase())
        );

        console.log("locallyAnalyzePosts");

        if (matches) {
          return {
            post,
            shouldHide: true,
            category,
          };
        }
      }

      // If no matches found, don't hide the post
      return {
        post,
        shouldHide: false,
        category: null,
      };
    });
  } catch (error) {
    console.error("Error analyzing posts locally:", error);
    // In case of error, return all posts as not to be hidden
    return posts.map((post) => ({
      post,
      shouldHide: false,
      category: null,
    }));
  }
}
