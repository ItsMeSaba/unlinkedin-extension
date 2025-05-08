import { getAuthToken } from "./get-auth-token";
import { logout } from "./logout";

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
