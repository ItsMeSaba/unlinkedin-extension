import {
  postClassName,
  postDescriptionSelector,
  postSelector,
} from "../data/selectors";
import { analyzePosts } from "./analyze-post";
import { hidePost } from "./hide-post";
import { updateStats } from "../stats/stats";
import { removeAdPost } from "./remove-ad-post";
import { locallyAnalyzePosts } from "./locally-analyze-post";
import { generatePostId } from "./generate-post-id";

// Set to store already checked post IDs
// const checkedPosts = new Set();

export async function scanFeed() {
  console.log("Scanning feed...");

  const posts = document.getElementsByClassName(postClassName);

  console.log("posts", posts);

  // Filter out already processed posts and ads
  const newPosts = Array.from(posts).filter((post) => {
    // const descriptionDiv = post.querySelector(postDescriptionSelector);
    // const postText = descriptionDiv?.innerText || "";
    // const postId = generatePostId(postText);

    // if (checkedPosts.has(postId)) {
    //   return false;
    // }

    // Remove ads before analysis
    if (removeAdPost(post)) {
      return false;
    }

    // Mark post as processed and remove class
    // checkedPosts.add(postId);
    post.classList.remove(postClassName);
    post.style.marginBottom = "8px";
    return true;
  });

  if (newPosts.length === 0) {
    return;
  }

  // Analyze posts in batch
  const results = await locallyAnalyzePosts(newPosts);

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
