import { postSelector } from "../data/selectors";
import { analyzePost } from "./analyze-post";
import { hidePost } from "./hide-post";

// Set to store already checked post IDs
const checkedPosts = new Set();

export async function scanFeed() {
  console.log("Scanning feed...");

  const posts = document.querySelectorAll(postSelector);

  for (const post of posts) {
    // Use data-id attribute or some unique identifier from the post
    const postId = generatePostId(post);

    // Only process posts we haven't seen before
    if (!checkedPosts.has(postId)) {
      const { shouldHide, category } = await analyzePost(post);

      if (shouldHide) {
        hidePost(post, category);
      }

      checkedPosts.add(postId);
    }
  }
}

// Generate a unique identifier for posts that don't have one
function generatePostId(post) {
  // Use post content or position as a unique identifier
  return `post-${post.innerText.slice(0, 20)}-${post.offsetTop}`;
}
