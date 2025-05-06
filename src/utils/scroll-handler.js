// Handles scroll events and triggers feed scanning
const SCROLL_THRESHOLD = 500;
let lastScrollPosition = SCROLL_THRESHOLD;

export function initializeScrollHandler(onScroll) {
  window.addEventListener("scroll", () => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > lastScrollPosition) {
      lastScrollPosition += SCROLL_THRESHOLD;
      onScroll();
    }
  });
}
