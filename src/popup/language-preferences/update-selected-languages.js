import { languages } from "../../data/languages";

/**
 * Update the selected languages UI
 * @param {Object} selectedLanguages - Object with language codes as keys and enabled status as values
 * @param {HTMLElement} selectedLanguagesContainer - The container element
 * @param {Function} savePreferences - Function to save preferences
 */
export function updateSelectedLanguages(
  selectedLanguages,
  selectedLanguagesContainer,
  savePreferences
) {
  selectedLanguagesContainer.innerHTML = "";

  const entries = Object.entries(selectedLanguages);

  if (entries.length === 0) {
    selectedLanguagesContainer.innerHTML =
      '<div class="no-languages">No languages selected</div>';
    return;
  }

  entries.forEach(([code, enabled]) => {
    const tag = document.createElement("div");
    tag.className = "language-tag";
    tag.dataset.code = code;

    tag.innerHTML = `
      <span>${languages[code]}</span>
      <div class="language-tag-controls">
        <label class="switch">
          <input type="checkbox" ${enabled ? "checked" : ""}>
          <span class="slider"></span>
        </label>
        <button class="remove-language" title="Remove language">×</button>
      </div>
    `;

    // Add event listener for the toggle
    tag.querySelector("input").addEventListener("change", savePreferences);

    // Add event listener for the remove button
    tag
      .querySelector(".remove-language")
      .addEventListener("click", async () => {
        // Get current language preferences
        const { languageFilter = { enabled: true, languages: {} } } =
          await chrome.storage.sync.get("languageFilter");

        // Remove the language
        delete languageFilter.languages[code];

        // Update UI and save
        updateSelectedLanguages(
          languageFilter.languages,
          selectedLanguagesContainer,
          savePreferences
        );
        await savePreferences();
      });

    selectedLanguagesContainer.appendChild(tag);
  });
}
