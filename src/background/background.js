import { getAuthToken, logout } from "../utils/auth";

// const API_ENDPOINT = "https://linkedout-backend-u458.onrender.com/api/analyze";
const API_ENDPOINT = "http://localhost:3000/api/analyze";

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_AUTH_TOKEN") {
    getAuthToken(request.interactive)
      .then((token) => sendResponse({ token }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }

  if (request.type === "ANALYZE_POSTS") {
    analyzePosts(request.posts)
      .then((results) => sendResponse(results))
      .catch((error) => {
        console.error("Error analyzing posts:", error);
        sendResponse({ error: error.message });
      });

    // Return true to indicate we will send response asynchronously
    return true;
  }
});

async function analyzePosts(posts) {
  try {
    // Get auth token and filter preferences
    const [token, { filters = {} }] = await Promise.all([
      getAuthToken(),
      chrome.storage.sync.get("filters"),
    ]);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        posts,
        filters,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be invalid, remove it and try again
        await logout();
        return analyzePosts(posts);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Map API results to the format expected by the content script
    return data.results.map((result) => ({
      shouldHide: parseInt(result.isApproved) === 0,
      category: result.category,
    }));
  } catch (error) {
    console.error("Error in analyzePosts:", error);
    throw error;
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("linkedin.com/feed")) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["/src/index.js"],
    });
  }
});
