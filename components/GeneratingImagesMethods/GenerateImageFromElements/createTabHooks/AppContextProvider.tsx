"use client";

/*
 * NextJS & ReactJS components
 * */
import React, { PropsWithChildren, useContext } from "react";

/*
 * App state
 * */
import { AppStateContext, useAppState } from "./State";

export const AppStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const state = useAppState();

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error(
      "useAppStateContext must be used within a AppStateProvider",
    );
  }
  return context;
};
