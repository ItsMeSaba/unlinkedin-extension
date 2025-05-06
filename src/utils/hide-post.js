/**
 * Hides a post by adding an overlay
 * @param {HTMLElement} post - The post element to hide
 * @param {string} category - The category/reason why post was hidden
 */
export function hidePost(post, category = "unspecified") {
  // Ensure post has relative positioning for absolute overlay
  post.style.position = "relative";

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "linkedout-overlay";

  overlay.innerHTML = `
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
  const showButton = overlay.querySelector(".linkedout-show-post");
  showButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    overlay.remove();
  });

  // Add overlay to post
  post.appendChild(overlay);

  // Add styles if not already added
  if (!document.getElementById("linkedout-styles")) {
    const style = document.createElement("style");
    style.id = "linkedout-styles";
    style.textContent = `
      .linkedout-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f3f6f8;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }

      .linkedout-removal-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        max-width: 90%;
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
        white-space: nowrap;
      }

      .linkedout-show-post:hover {
        background: #084e96;
      }
    `;
    document.head.appendChild(style);
  }
}
