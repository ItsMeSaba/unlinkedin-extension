import { createFilterOptions } from "./filter-options/create-filter-options";
import { initializeLanguagePreferences } from "./language-preferences";

console.log("Popup.js loaded");

// Initialize popup
async function initializePopup() {
  console.log("Initializing popup");

  await Promise.all([createFilterOptions(), initializeLanguagePreferences()]);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePopup);
