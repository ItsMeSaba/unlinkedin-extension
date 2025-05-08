/**
 * Get the auth token for the current user
 * @param {boolean} interactive - Whether to show the auth popup if needed
 * @returns {Promise<string>} The auth token
 */
export async function getAuthToken(interactive = true) {
  // If we're in the background script (has access to chrome.identity)
  if (chrome.identity && chrome.identity.getAuthToken) {
    try {
      const token = await new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive }, (token) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(token);
        });
      });

      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw error;
    }
  }

  // If we're in a content script (needs message passing)
  const response = await chrome.runtime.sendMessage({
    type: "GET_AUTH_TOKEN",
    interactive,
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.token;
}
