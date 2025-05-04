// const API_ENDPOINT = "https://linkedout-backend-u458.onrender.com/api/analyze";
const API_ENDPOINT = "http://localhost:3000/api/analyze";

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ANALYZE_POST") {
    analyzePost(request.postText)
      .then((result) => sendResponse(result))
      .catch((error) => {
        console.error("Error analyzing post:", error);
        sendResponse({ error: error.message });
      });

    // Return true to indicate we will send response asynchronously
    return true;
  }
});

async function analyzePost(postText) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      posts: [postText],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Linkedout: Result Data:", data);
  return {
    shouldHide: parseInt(data?.results?.[0]?.isApproved) === 0,
    category: data?.results?.[0]?.category,
  };
}
