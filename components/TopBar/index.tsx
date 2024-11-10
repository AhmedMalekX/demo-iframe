"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Store
 * */
import { useTabsStore } from "@/store/tabs.store";

/*
 * Constants
 * */
import { Tabs } from "@/constants";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Types
 * */
import { ITabs } from "@/types";

export const TopBar = () => {
  // tab store
  const { activeTab, setActiveTab } = useTabsStore();

  return (
    <nav className="flex gap-x-8 bg-white px-6 py-4 rounded-xl drop-shadow-sm">
      {Tabs.map((tab: ITabs) => (
        <div
          className={cn(
            activeTab === tab &&
              "border-b-4 border-appPrimaryActiveState transition-all duration-75 ease-in-out",
            activeTab !== tab &&
              "hover:border-b-4 hover:border-appPrimaryActiveState/50 transition-all duration-75 ease-in-out",
          )}
          key={tab}
          role="button"
          onClick={() => {
            setActiveTab(tab);
          }}
          aria-label={`Switch to ${tab} tab`}
        >
          <span className="text-xl cursor-pointer selection:bg-appPrimaryActiveState/50 selection:text-white">
            {tab}
          </span>
        </div>
      ))}
    </nav>
  );
};
