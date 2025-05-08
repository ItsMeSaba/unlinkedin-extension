import { defaultFilters } from "../../data/default-filters";

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

export async function createFilterOptions() {
  const { filters = defaultFilters } = await chrome.storage.sync.get("filters");
  const filterOptionsElement = document.getElementById("filterOptions");

  console.log("Creating filter options", filters);

  Object.entries(filters).forEach(([id, option]) => {
    const filterElement = createFilterOption(id, option);
    filterOptionsElement.appendChild(filterElement);

    // Add change listener
    const checkbox = filterElement?.querySelector(`input`);

    checkbox?.addEventListener("change", async (e) => {
      const { filters = defaultFilters } = await chrome.storage.sync.get(
        "filters"
      );

      filters[id].enabled = e.target.checked;

      await chrome.storage.sync.set({ filters });
    });
  });
}
