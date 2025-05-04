import { postDescriptionSelector } from "../data/selectors";

/**
 * Analyzes a post using the AI backend and returns whether it should be hidden
 * @param {HTMLElement} post - The post element to analyze
 * @returns {Promise<boolean>} - Returns true if post should be hidden
 */
export async function analyzePost(post) {
  try {
    const descriptionDiv = post.querySelector(postDescriptionSelector);

    // Extract post content
    const postText = descriptionDiv?.innerText?.slice(0, 600) || "";

    console.log("Linkedout: Analyzing post:\n", postText);

    // Send message to background script
    const result = await chrome.runtime.sendMessage({
      type: "ANALYZE_POST",
      postText,
    });

    if (result.error) {
      console.log("Linkedout: Result Error:", result);
      throw new Error(result.error);
    }

    console.log("Linkedout: Result Should Hide:", result);
    return { shouldHide: result.shouldHide, category: result.category };
  } catch (error) {
    console.error("Error analyzing post:", error);
    // In case of error, we're conservative and don't hide the post
    return false;
  }
}
