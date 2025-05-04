import { initializeScrollHandler } from "./utils/scroll-handler";
import { scanFeed } from "./utils/feed-scanner";

console.log("Linkedout: Starting to scan feed");

scanFeed();

initializeScrollHandler(scanFeed);
