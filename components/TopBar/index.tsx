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

export const TopBar = () => {
  // tab store
  const { activeTab, setActiveTab } = useTabsStore();

  return (
    <nav className="w-full bg-white px-4 py-4 rounded-xl drop-shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-center">
        {Tabs.map((tab) => (
          <div
            className={cn(
              activeTab === tab &&
                "border-b-4 border-appPrimaryActiveState transition-all duration-75 ease-in-out",
              activeTab !== tab &&
                "hover:border-b-4 hover:border-appPrimaryActiveState/50 transition-all duration-75 ease-in-out",
              "px-2 w-full h-full md:w-fit text-center",
            )}
            key={tab}
            role="button"
            onClick={() => {
              setActiveTab(tab);
            }}
            aria-label={`Switch to ${tab} tab`}
          >
            <span className="text-lg font-medium cursor-pointer selection:bg-appPrimaryActiveState/50 selection:text-white">
              {tab}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
};
