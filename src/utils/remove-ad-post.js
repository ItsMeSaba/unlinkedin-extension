import { postMetadataSelector } from "../data/selectors";

/**
 * Removes promoted posts from the feed
 * @param {HTMLElement} post - The post element to check
 * @returns {boolean} - Returns true if post was removed
 */
export function removeAdPost(post) {
  const metadata = post.querySelector(postMetadataSelector);

  if (metadata?.innerText?.includes("Promoted")) {
    post.remove();

    return true;
  }

  return false;
}
