import { postSelector } from "../data/selectors";
import { analyzePosts } from "./analyze-post";
import { hidePost } from "./hide-post";

// Set to store already checked post IDs
const checkedPosts = new Set();

export async function scanFeed() {
  console.log("Scanning feed...");

  const posts = document.querySelectorAll(postSelector);

  // Filter out already processed posts
  const newPosts = Array.from(posts).filter((post) => {
    const postId = generatePostId(post);
    return !checkedPosts.has(postId);
  });

  if (newPosts.length === 0) {
    return;
  }

  // Analyze posts in batch
  const results = await analyzePosts(newPosts);

  console.log("results", results);

  // Process results
  results.forEach(({ post, shouldHide, category }) => {
    const postId = generatePostId(post);

    if (shouldHide) {
      hidePost(post, category);
    }

    checkedPosts.add(postId);
  });
}

// Generate a unique identifier for posts that don't have one
function generatePostId(post) {
  // Use post content or position as a unique identifier
  return `post-${post.innerText.slice(0, 20)}-${post.offsetTop}`;
}
