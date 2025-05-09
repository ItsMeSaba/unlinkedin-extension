import { languages } from "../../data/languages";

/**
 * Handle language input and show autocomplete suggestions
 * @param {string} query - The search query
 * @param {HTMLElement} languageAutocomplete - The autocomplete container element
 * @returns {Array} Array of suggestions
 */
export function handleLanguageInput(query, languageAutocomplete) {
  if (!query) {
    languageAutocomplete.style.display = "none";
    return [];
  }

  // Filter languages based on input
  const suggestions = Object.entries(languages)
    .filter(([code, name]) => {
      const alreadySelected = !!document.querySelector(
        `.language-tag[data-code="${code}"]`
      );
      return (
        !alreadySelected && name.toLowerCase().includes(query.toLowerCase())
      );
    })
    .slice(0, 5);

  // Show autocomplete suggestions
  if (suggestions.length > 0) {
    languageAutocomplete.innerHTML = suggestions
      .map(
        ([code, name]) => `
        <div class="autocomplete-item" data-code="${code}">
          ${name}
        </div>
      `
      )
      .join("");

    languageAutocomplete.style.display = "block";
  } else {
    languageAutocomplete.style.display = "none";
  }

  return suggestions;
}

/**
 * Handle selection from autocomplete
 * @param {HTMLElement} selectedItem - The selected autocomplete item
 * @param {HTMLElement} languageInput - The input element
 * @param {HTMLElement} languageAutocomplete - The autocomplete container element
 * @param {Function} updateSelectedLanguages - Function to update the UI
 * @param {Function} savePreferences - Function to save preferences
 */
export async function handleAutocompleteSelection(
  selectedItem,
  languageInput,
  languageAutocomplete,
  updateSelectedLanguages,
  savePreferences
) {
  if (!selectedItem) return;

  const code = selectedItem.dataset.code;

  // Get current selected languages
  const { languageFilter = { enabled: true, languages: {} } } =
    await chrome.storage.sync.get("languageFilter");

  // Add new language
  languageFilter.languages[code] = true;

  // Update UI and save
  updateSelectedLanguages(languageFilter.languages);
  await savePreferences();

  // Clear input and hide autocomplete
  languageInput.value = "";
  languageAutocomplete.style.display = "none";
}
