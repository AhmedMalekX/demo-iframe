"use client";
/*
 * React & Next.js components
 * */

import React from "react";

/*
 * Hooks
 * */
import { useAppStateContext } from "@/app/(routes)/dashboard/_createTab/_hooks/AppContextProvider";
import { AppStateUtils } from "@/app/(routes)/dashboard/_createTab/_hooks/AppState";

// Placeholder functions for saving and loading app state

export const MenuSaveAndLoad: React.FC = () => {
  const { appState, dispatch } = useAppStateContext();
  const [jsonString, setJsonString] = React.useState<string>("");

  async function saveAppState(): Promise<void> {
    const string = AppStateUtils.ConvertStateToJsonString(appState);
    setJsonString(string);
    console.log(string);
  }

  async function loadAppState(): Promise<void> {
    const state = await AppStateUtils.ConvertJsonStringToState(jsonString);
    dispatch({ type: "RESET_TO", state });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <button onClick={saveAppState}>Save</button>
      <input
        type="text"
        value={jsonString}
        onChange={(e) => setJsonString(e.target.value)}
      />
      <button onClick={loadAppState}>Load</button>
    </div>
  );
};
