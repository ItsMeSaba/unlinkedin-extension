// Handles scroll events and triggers feed scanning
let lastScrollPosition = 1000;

export function initializeScrollHandler(onScroll) {
  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    
    if (currentScrollPosition > lastScrollPosition) {
      lastScrollPosition += 1000;
      onScroll();
    }
  });
} 