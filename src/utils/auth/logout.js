import { getAuthToken } from "./get-auth-token";

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
