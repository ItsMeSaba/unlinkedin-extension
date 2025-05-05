import { postDescriptionSelector } from "../data/selectors";

/**
 * Hides a post by replacing its content with removal information
 * @param {HTMLElement} post - The post element to hide
 * @param {string} category - The category/reason why post was hidden
 */
export function hidePost(post, category = "unspecified") {
  // Store original content for later restoration
  const originalContent = post.innerHTML;

  // Create removal message element
  const removalMessage = document.createElement("div");
  removalMessage.className = "linkedout-removal-message";

  removalMessage.innerHTML = `
    <div class="linkedout-removal-content">
      <div class="linkedout-removal-icon">🚫</div>
      <div class="linkedout-removal-text">
        <p>Post hidden by LinkedOut</p>
        <p class="linkedout-removal-reason">Reason: ${category}</p>
      </div>
      <button class="linkedout-show-post">Show Post</button>
    </div>
  `;

  // Add event listener to restore button
  const showButton = removalMessage.querySelector(".linkedout-show-post");
  showButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    post.innerHTML = originalContent;
  });

  // Replace post content
  post.innerHTML = "";
  post.appendChild(removalMessage);

  // Add styles if not already added
  if (!document.getElementById("linkedout-styles")) {
    const style = document.createElement("style");
    style.id = "linkedout-styles";
    style.textContent = `
      .linkedout-removal-message {
        padding: 16px;
        background: #f3f6f8;
        border-radius: 8px;
        margin: 8px 0;
      }

      .linkedout-removal-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .linkedout-removal-icon {
        font-size: 24px;
      }

      .linkedout-removal-text {
        flex-grow: 1;
      }

      .linkedout-removal-text p {
        margin: 0;
        color: #666;
      }

      .linkedout-removal-text p:first-child {
        font-weight: 600;
        color: #333;
      }

      .linkedout-removal-reason {
        font-size: 14px;
        margin-top: 4px !important;
      }

      .linkedout-show-post {
        background: #0a66c2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 16px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .linkedout-show-post:hover {
        background: #084e96;
      }
    `;
    document.head.appendChild(style);
  }
}
