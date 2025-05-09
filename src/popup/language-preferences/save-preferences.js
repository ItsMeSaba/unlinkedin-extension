/**
 * Save language preferences to storage
 * @param {HTMLElement} languageFilterToggle - The toggle element
 * @param {HTMLElement} selectedLanguagesContainer - The container with selected languages
 */
export async function saveLanguagePreferences(
  languageFilterToggle,
  selectedLanguagesContainer
) {
  const selectedLanguages = {};
  selectedLanguagesContainer
    .querySelectorAll(".language-tag")
    .forEach((tag) => {
      const code = tag.dataset.code;
      const enabled = tag.querySelector("input[type='checkbox']").checked;
      selectedLanguages[code] = enabled;
    });

  await chrome.storage.sync.set({
    languageFilter: {
      enabled: languageFilterToggle.checked,
      languages: selectedLanguages,
    },
  });
}
