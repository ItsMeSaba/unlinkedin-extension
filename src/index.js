import { scanFeed } from "./utils/feed-scanner";
import { removeInitialBloat } from "./utils/remove-initial-bloat";
import { initializeScrollHandler } from "./utils/scroll-handler";
import { getAuthToken } from "./utils/auth";

// Only initialize if user is authenticated
async function initialize() {
  try {
    // Check if user is authenticated
    await getAuthToken(false);

    // Remove unnecessary UI elements first
    removeInitialBloat();

    // Initial scan
    console.log("Linkedout: Starting to scan feed...");
    scanFeed();

    // Scan per scroll
    initializeScrollHandler(scanFeed);
  } catch (error) {
    console.log("Linkedout: User not authenticated, skipping initialization");
  }
}

initialize();
