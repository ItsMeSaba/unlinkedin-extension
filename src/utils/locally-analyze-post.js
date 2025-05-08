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
    // const { filters = {} } = await chrome.storage.sync.get("filters");

    // Extract text content and analyze each post
    return posts.map((post) => {
      const descriptionDiv = post.querySelector(postDescriptionSelector);
      const postText = (descriptionDiv?.innerText || "").toLowerCase();

      // Check each category's keywords if the filter is enabled
      for (const [category, keywords] of Object.entries(filtrationKeywords)) {
        // if (filters[category]?.enabled === false) continue;

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
