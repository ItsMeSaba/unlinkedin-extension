import { createFilterOptions } from "./filter-options/create-filter-options";
import { createUserSection } from "./user-account/create-user-section";

console.log("Popup.js loaded");

// Initialize popup
async function initializePopup() {
  console.log("Initializing popup");
  // await Promise.all([createUserSection(), createFilterOptions()]);
  await createFilterOptions();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePopup);
