import { getUserInfo, getAuthToken, logout } from "../utils/auth";

// Default filter options
const defaultFilters = {
  flexing: {
    label: "Flexing & Humble Brags",
    enabled: true,
  },
  jobHunting: {
    label: "Job Hunting",
    enabled: true,
  },
  selfPromotion: {
    label: "Self Promotion",
    enabled: true,
  },
  inspiration: {
    label: "Inspiration Posts",
    enabled: true,
  },
  networking: {
    label: "Open Networking",
    enabled: false,
  },
};

// Create and append toggle switch element
function createToggleSwitch(id, checked) {
  return `
    <label class="switch">
      <input type="checkbox" id="${id}" ${checked ? "checked" : ""}>
      <span class="slider"></span>
    </label>
  `;
}

// Create filter option element
function createFilterOption(id, option) {
  const div = document.createElement("div");
  div.className = "filter-option";
  div.innerHTML = `
    <div>
      <div class="filter-label">${option.label}</div>
    </div>
    ${createToggleSwitch(id, option.enabled)}
  `;
  return div;
}

// Create user info section
async function createUserSection() {
  const div = document.createElement("div");
  div.className = "user-section";

  try {
    const userInfo = await getUserInfo();
    div.innerHTML = `
      <div class="user-info">
        <img src="${userInfo.picture}" alt="${userInfo.name}" class="user-avatar">
        <div class="user-details">
          <div class="user-name">${userInfo.name}</div>
          <div class="user-email">${userInfo.email}</div>
        </div>
      </div>
      <button id="signout" class="signout-button">Sign Out</button>
    `;

    // Add sign out handler
    div.querySelector("#signout").addEventListener("click", async () => {
      try {
        await logout();
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
        // Force reload even if there was an error
        window.location.reload();
      }
    });
  } catch (error) {
    console.log("User not authenticated:", error);

    div.innerHTML = `
      <div class="auth-prompt">
        <p>Please sign in to use LinkedOut</p>
        <button id="signin" class="signin-button">Sign In</button>
      </div>
    `;

    // Add sign in handler
    div.querySelector("#signin").addEventListener("click", async () => {
      try {
        await getAuthToken(true);
        window.location.reload();
      } catch (error) {
        console.error("Sign in failed:", error);
      }
    });
  }

  return div;
}

// Initialize popup
async function initializePopup() {
  const container = document.getElementById("container");

  // Add user section
  const userSection = await createUserSection();
  container.insertBefore(userSection, container.firstChild);

  try {
    // Ensure user is authenticated
    await getAuthToken(false);

    // Get stored filters or use defaults
    const { filters = defaultFilters } = await chrome.storage.sync.get(
      "filters"
    );
    const filterOptionsElement = document.getElementById("filterOptions");

    // Create and append filter options
    Object.entries(filters).forEach(([id, option]) => {
      const filterElement = createFilterOption(id, option);
      filterOptionsElement.appendChild(filterElement);

      // Add change listener
      const checkbox = filterElement.querySelector(`#${id}`);
      checkbox.addEventListener("change", async (e) => {
        const { filters } = await chrome.storage.sync.get("filters");
        filters[id].enabled = e.target.checked;
        await chrome.storage.sync.set({ filters });
      });
    });
  } catch (error) {
    // If not authenticated, hide filter options
    document.getElementById("filterOptions").style.display = "none";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePopup);
