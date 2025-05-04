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

// Initialize popup
async function initializePopup() {
  // Get stored filters or use defaults
  const { filters = defaultFilters } = await chrome.storage.sync.get("filters");

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
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePopup);
