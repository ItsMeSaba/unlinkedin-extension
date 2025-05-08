import { postDescriptionSelector } from "../data/selectors";

/**
 * Analyzes multiple posts using the AI backend
 * @param {HTMLElement[]} posts - Array of post elements to analyze
 * @returns {Promise<Array<{post: HTMLElement, shouldHide: boolean, category: string}>>}
 */
export async function analyzePosts(posts) {
  try {
    const postsData = posts.map((post) => {
      const descriptionDiv = post.querySelector(postDescriptionSelector);
      const descriptionText = descriptionDiv?.innerText?.slice(0, 500) || "";
      return { post, text: descriptionText };
    });

    console.log(`Linkedout: Analyzing ${posts.length} posts`);

    const results = await chrome.runtime.sendMessage({
      type: "ANALYZE_POSTS",
      posts: postsData.map((p) => p.text),
    });

    if (results.error) {
      throw new Error(results.error);
    }

    return postsData.map((postData, index) => ({
      post: postData.post,
      shouldHide: results[index]?.shouldHide || false,
      category: results[index]?.category || null,
    }));
  } catch (error) {
    console.error("Error analyzing posts:", error);

    // In case of error, don't hide any posts
    return posts.map((post) => ({
      post,
      shouldHide: false,
      category: null,
    }));
  }
}
