"use client";

/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState, useRef } from "react";

/*
 * UI components
 * */
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/*
 * Icons
 * */
import { LoaderCircle } from "lucide-react";

export default function Parent() {
  const [isMounted, setIsMounted] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  // Prevent updates after unmount
  const isComponentMounted = useRef(true);

  const logMessage = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  useEffect(() => {
    // Set flag on mount and cleanup on unmount
    isComponentMounted.current = true;
    setIsMounted(true);

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Async handler for incoming messages
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin ===
          (process.env.NEXT_PUBLIC_PARENT_SITE_URL ||
            "http://localhost:3000") &&
        event.data
      ) {
        console.log("Message received from child:", event.data);

        if (event.data.message === "accessToken") {
          const receivedAccessToken = event.data.token;

          if (receivedAccessToken) {
            setAccessToken(receivedAccessToken);
            logMessage("Access token received from child.");

            try {
              const response = await fetch("/api/validate-access-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: receivedAccessToken }),
              });

              const data = await response.json();

              if (!response.ok) {
                if (response.status === 401) {
                  logMessage(
                    "Access token is expired. Attempting to refresh...",
                  );

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
                logMessage("Access token is valid.");
              }
            } catch (error) {
              logMessage(
                `Access token verification failed: ${
                  (error as { message: string }).message
                }`,
              );
            }
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isMounted]);

  // Return loading screen during initial hydration to avoid mismatches
  if (!isMounted) {
    return (
      <main className="h-screen max-w-7xl mx-auto flex items-center justify-center">
        <LoaderCircle className="animate-spin" size={32} />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-10">
      <div>
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
