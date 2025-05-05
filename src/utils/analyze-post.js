import { postDescriptionSelector } from "../data/selectors";

/**
 * Analyzes multiple posts using the AI backend
 * @param {HTMLElement[]} posts - Array of post elements to analyze
 * @returns {Promise<Array<{post: HTMLElement, shouldHide: boolean, category: string}>>}
 */
export async function analyzePosts(posts) {
  try {
    // Extract text content from all posts
    const postsData = posts.map((post) => {
      const descriptionDiv = post.querySelector(postDescriptionSelector);
      const postText = descriptionDiv?.innerText?.slice(0, 500) || "";
      return { post, text: postText };
    });

    console.log(`Linkedout: Analyzing ${posts.length} posts`);

    // Send message to background script
    const results = await chrome.runtime.sendMessage({
      type: "ANALYZE_POSTS",
      posts: postsData.map((p) => p.text),
    });

    console.log("results from runtime", results);

    if (results.error) {
      throw new Error(results.error);
    }

    // Map results back to posts
    return postsData.map((postData, index) => ({
      post: postData.post,
      shouldHide: results[index]?.shouldHide || false,
      category: results[index]?.category || null,
    }));
  } catch (error) {
    console.error("Error analyzing posts:", error);
    // In case of error, return all posts as not to be hidden
    return posts.map((post) => ({
      post,
      shouldHide: false,
      category: null,
    }));
  }
}
