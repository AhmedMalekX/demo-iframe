/*
 * TODO: Add Zustand state to handle the token and different types of events and messages
 * */

export const handleEventListener = async (event: MessageEvent) => {
  if (
    event.origin ===
      (process.env.NEXT_PUBLIC_PARENT_SITE_URL || "http://localhost:3000") &&
    event.data
  ) {
    console.log("Message received from child:", event.data);

    if (event.data.message === "accessToken") {
      const receivedAccessToken = event.data.token;

      if (receivedAccessToken) {
        // setAccessToken(receivedAccessToken);
        // logMessage("Access token received from child.");

        try {
          const response = await fetch("/api/validate-access-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: receivedAccessToken }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              // logMessage("Access token is expired. Attempting to refresh...");

              // Notify parent about token expiry
              (event.source as Window).postMessage(
                {
                  message: "tokenExpired",
                  accessToken: null,
                },
                event.origin,
              );
            } else {
              throw new Error(data.message || "Invalid access token");
            }
          } else {
            // logMessage("Access token is valid.");
          }
        } catch (error) {
          console.log({ error });
          // logMessage(
          //   `Access token verification failed: ${
          //     (error as { message: string }).message
          //   }`,
          // );
        }
      }
    }
  }
};
