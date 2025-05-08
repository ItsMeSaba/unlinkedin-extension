// Create user info section
export async function createUserSection() {
  const div = document.createElement("div");
  div.className = "user-section";

  try {
    const userInfo = await getUserInfo();
    div.innerHTML = `
      <div class="user-info">
        <img src="${userInfo.picture}" alt="${userInfo.name}" class="user-avatar">
        <div class="user-details">
          <div class="user-name">${userInfo.name}</div>
          <div class="user-email">${userInfo.email}</div>
        </div>
      </div>
      <button id="signout" class="signout-button">Sign Out</button>
    `;

    // Add sign out handler
    div.querySelector("#signout").addEventListener("click", async () => {
      try {
        await logout();
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
        // Force reload even if there was an error
        window.location.reload();
      }
    });
  } catch (error) {
    console.log("User not authenticated:", error);

    div.innerHTML = `
      <div class="auth-prompt">
        <p>Please sign in to use LinkedOut</p>
        <button id="signin" class="signin-button">Sign In</button>
      </div>
    `;

    // Add sign in handler
    div.querySelector("#signin").addEventListener("click", async () => {
      try {
        await getAuthToken(true);
        window.location.reload();
      } catch (error) {
        console.error("Sign in failed:", error);
      }
    });
  }

  document.getElementById("user-section").appendChild(div);

  return true;
}
