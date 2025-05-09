/**
 * Load saved language preferences from storage
 * @param {HTMLElement} languageFilterToggle - The toggle element
 * @param {HTMLElement} languageFilterContent - The content container element
 * @param {Function} updateSelectedLanguages - Function to update the UI
 */
export async function loadLanguagePreferences(
  languageFilterToggle,
  languageFilterContent,
  updateSelectedLanguages
) {
  const { languageFilter = { enabled: false, languages: {} } } =
    await chrome.storage.sync.get("languageFilter");

  languageFilterToggle.checked = languageFilter.enabled;
  languageFilterContent.style.display = languageFilter.enabled
    ? "block"
    : "none";

  updateSelectedLanguages(languageFilter.languages);
}
