import { scanFeed } from "./utils/feed-scanner";
import { removeInitialBloat } from "./utils/remove-initial-bloat";
import { initializeScrollHandler } from "./utils/scroll-handler";

// Only initialize if user is authenticated
async function initialize() {
  // Remove unnecessary UI elements first
  removeInitialBloat();

  // Initial scan
  console.log("Linkedout: Starting to scan feed...");
  scanFeed();

  // Scan per scroll
  initializeScrollHandler(scanFeed);
}

initialize();
