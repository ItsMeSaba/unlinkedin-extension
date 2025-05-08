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

/**
 * Remove the cached auth token and revoke access
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    const token = await getAuthToken(false);
    if (!token) return;

    // First revoke the token
    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);

    // Then remove it from Chrome's cache
    await new Promise((resolve, reject) => {
      chrome.identity.removeCachedAuthToken({ token }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      });
    });

    // Clear any additional stored data if needed
    await chrome.storage.sync.clear();
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

/**
 * Get the user info using the auth token
 * @returns {Promise<{email: string, name: string}>}
 */
export async function getUserInfo() {
  const token = await getAuthToken();

  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be invalid, try to logout and throw error
      await logout();
      throw new Error("Authentication failed. Please sign in again.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const userInfo = await response.json();
  console.log("User info:", userInfo);

  return userInfo;
}
