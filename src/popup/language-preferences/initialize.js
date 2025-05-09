import {
  loadLanguagePreferences,
  saveLanguagePreferences,
  updateSelectedLanguages,
  handleLanguageInput,
  handleAutocompleteSelection,
} from "./";

/**
 * Initialize language preferences functionality
 */
export function initializeLanguagePreferences() {
  const languageFilterToggle = document.getElementById("languageFilterToggle");
  const languageFilterContent = document.getElementById(
    "languageFilterContent"
  );
  const languageInput = document.getElementById("languageInput");
  const languageAutocomplete = document.getElementById("languageAutocomplete");
  const selectedLanguagesContainer =
    document.getElementById("selectedLanguages");

  // Bind save preferences to the current elements
  const boundSavePreferences = () =>
    saveLanguagePreferences(languageFilterToggle, selectedLanguagesContainer);

  // Bind update selected languages to the current elements
  const boundUpdateSelectedLanguages = (languages) =>
    updateSelectedLanguages(
      languages,
      selectedLanguagesContainer,
      boundSavePreferences
    );

  // Load preferences
  loadLanguagePreferences(
    languageFilterToggle,
    languageFilterContent,
    boundUpdateSelectedLanguages
  );

  // Handle language filter toggle
  languageFilterToggle?.addEventListener("change", () => {
    languageFilterContent.style.display = languageFilterToggle.checked
      ? "block"
      : "none";
    boundSavePreferences();
  });

  // Handle language input
  let currentSuggestions = [];
  languageInput.addEventListener("input", () => {
    currentSuggestions = handleLanguageInput(
      languageInput.value,
      languageAutocomplete
    );
  });

  // Handle autocomplete selection
  languageAutocomplete.addEventListener("click", (e) => {
    const item = e.target.closest(".autocomplete-item");
    handleAutocompleteSelection(
      item,
      languageInput,
      languageAutocomplete,
      boundUpdateSelectedLanguages,
      boundSavePreferences
    );
  });

  // Close autocomplete when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".language-input-container")) {
      languageAutocomplete.style.display = "none";
    }
  });
}
