export const validateAction = async (accessToken: string) => {
  let isValidToken: boolean = false;

  const response = await fetch("/api/validate-access-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: accessToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // logMessage("Access token is expired. Attempting to refresh...");

      isValidToken = false;
    } else {
      throw new Error(data.message || "Invalid access token");
    }
  } else {
    // logMessage("Access token is valid.");
    isValidToken = true;
  }

  return { isValidToken };
};
