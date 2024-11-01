"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

export default function Parent() {
  const [isMounted, setIsMounted] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const logMessage = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  // const handleNewAccessToken = useCallback(async () => {
  //   logMessage("User clicked on Request New Access Token button.");
  //
  //   try {
  //     logMessage("Requesting new access token (/api/get-new-access-token)...");
  //
  //     const response = await fetch("/api/get-new-access-token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ refreshToken }),
  //     });
  //
  //     logMessage(`API response status: ${response.status}`);
  //
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch new access token");
  //     }
  //
  //     const data = await response.json();
  //     setAccessToken(data.accessToken); // Update the access token
  //
  //     logMessage("New access token received successfully.");
  //     logMessage(`New Access Token: ${data.accessToken}`);
  //   } catch (error: unknown) {
  //     console.error("Error:", error);
  //     logMessage(
  //       `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
  //     );
  //   }
  // }, [refreshToken]);

  useEffect(() => {
    // Listen for messages
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin ===
          (process.env.CHILD_SITE_URL || "http://localhost:3000") &&
        event.data
      ) {
        console.log("Message received from child:", event.data);

        if (event.data.message === "accessToken") {
          const receivedAccessToken = event.data.token;

          if (receivedAccessToken) {
            setAccessToken(receivedAccessToken); // Update the access token state
            logMessage("Access token received from child.");

            // Verify the access token
            try {
              const response = await fetch("/api/validate-access-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: receivedAccessToken }),
              });

              const data = await response.json();

              console.log({ data });

              if (!response.ok) {
                if (response.status === 401) {
                  // Unauthorized, token expired
                  logMessage(
                    "Access token is expired. Attempting to refresh...",
                  );

                  // send event message back to the parent
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
                logMessage("Access token is valid.");
                // logMessage(`User ID from token: ${data.userId}`);
              }
            } catch (error) {
              logMessage(
                `Access token verification failed: ${(error as { message: string }).message}`,
              );
            }
          }
        } else {
          //
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="max-w-7xl mx-auto py-10">
      <div className="flex items-center justify-center text-3xl font-bold">
        <h1>iFrame</h1>
      </div>

      <div className="w-full flex space-x-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              placeholder="Type your prompt here."
              rows={5}
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/*<Button*/}
          {/*  className="w-full"*/}
          {/*  // onClick={handleNewAccessToken}*/}
          {/*>*/}
          {/*  Request New Access Token*/}
          {/*</Button>*/}
        </div>

        <div className="flex-1 w-full break-words max-w-6xl space-y-4">
          <h2 className="font-semibold text-xl">Result</h2>
          <hr />

          <div>
            <h3 className="font-semibold text-xl">Logs</h3>
            <ul className="mt-4 space-y-2">
              {logs.map((log, index) => (
                <li key={index}># {log}</li>
              ))}
            </ul>
          </div>

          <hr />
          <div>
            <h3 className="font-semibold text-xl">Tokens</h3>
            <ul className="mt-4 space-y-2">
              <li>Access Token: {accessToken}</li>
              <li>Refresh Token: {refreshToken}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
