/**
 * Removes unnecessary UI elements from LinkedIn feed
 * Should be called once when the extension starts
 */
export function removeInitialBloat() {
  try {
    // Remove ad banner container
    const adBanner = document.querySelector(".ad-banner-container");
    adBanner?.remove();
  } catch (error) {
    console.error("Error removing initial bloat:", error);
  }
}
