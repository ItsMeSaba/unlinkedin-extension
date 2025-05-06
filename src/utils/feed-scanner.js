import {
  postClassName,
  postDescriptionSelector,
  postSelector,
} from "../data/selectors";
import { analyzePosts } from "./analyze-post";
import { hidePost } from "./hide-post";
import { updateStats } from "./stats";
import { removeAds } from "./remove-ads";

// Set to store already checked post IDs
const checkedPosts = new Set();

export async function scanFeed() {
  console.log("Scanning feed...");

  const posts = document.getElementsByClassName(postClassName);

  console.log("posts", posts);

  // Filter out already processed posts and ads
  const newPosts = Array.from(posts).filter((post) => {
    const postId = generatePostId(post);

    if (checkedPosts.has(postId)) {
      return false;
    }

    // Remove ads before analysis
    if (removeAds(post)) {
      return false;
    }

    // Mark post as processed and remove class
    checkedPosts.add(postId);
    post.classList.remove(postClassName);
    post.style.marginBottom = "8px";
    return true;
  });

  if (newPosts.length === 0) {
    return;
  }

  // Analyze posts in batch
  const results = await analyzePosts(newPosts);

  // Track how many posts were hidden
  let hiddenCount = 0;

  // Process results
  results.forEach(({ post, shouldHide, category }) => {
    if (shouldHide) {
      hidePost(post, category);
      hiddenCount++;
    }
  });

  // Update stats with the number of posts analyzed and hidden
  updateStats(newPosts.length, hiddenCount);
}

// Generate a unique identifier for posts that don't have one
function generatePostId(post) {
  // Use post content or position as a unique identifier
  const descriptionDiv = post.querySelector(postDescriptionSelector);
  const postText = descriptionDiv?.innerText?.slice(0, 25) || "";
  return `post-${postText}`;
}
