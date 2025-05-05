// const API_ENDPOINT = "https://linkedout-backend-u458.onrender.com/api/analyze";
const API_ENDPOINT = "http://localhost:3000/api/analyze";

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
  // Get filter preferences
  const { filters = {} } = await chrome.storage.sync.get("filters");

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      posts,
      filters, // Send filter preferences to the API
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Linkedout: Result Data:", data);

  console.log("Linkedout: data.results:", data.results);

  // Map API results to the format expected by the content script
  return data.results.map((result) => ({
    shouldHide: parseInt(result.isApproved) === 0,
    category: result.category,
  }));
}
