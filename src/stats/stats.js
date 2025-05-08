// Stats object to track post counts
let stats = {
  analyzed: 0,
  hidden: 0,
};

// Create and append the stats button to the page
function createStatsButton() {
  const button = document.createElement("div");
  button.id = "linkedout-stats";
  button.innerHTML = `
    <img src="${chrome.runtime.getURL(
      "src/assets/linkedout-32.png"
    )}" class="logo" alt="LinkedOut" />
    <span class="stats">A: ${stats.analyzed} H: ${stats.hidden}</span>
  `;
  button.title = `LinkedOut Stats\nAnalyzed: ${stats.analyzed} posts\nHidden: ${stats.hidden} posts`;

  // Add the button to the page
  document.body.appendChild(button);

  return button;
}

// Update stats and button display
export function updateStats(analyzedCount, hiddenCount) {
  stats.analyzed += analyzedCount;
  stats.hidden += hiddenCount;

  const button =
    document.getElementById("linkedout-stats") || createStatsButton();

  button.querySelector(
    ".stats"
  ).textContent = `A: ${stats.analyzed} H: ${stats.hidden}`;

  button.title = `LinkedOut Stats\nAnalyzed: ${stats.analyzed} posts\nHidden: ${stats.hidden} posts`;
}

// Add styles for the stats button
const style = document.createElement("style");
style.textContent = `
  #linkedout-stats {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: white;
    color: #0a66c2;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: help;
    z-index: 9999;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: 2px solid #0a66c2;
  }

  #linkedout-stats:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  #linkedout-stats .logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  #linkedout-stats .stats {
    font-weight: 500;
    color: #0a66c2;
  }
`;

document.head.appendChild(style);
