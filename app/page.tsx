"use client";

/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useRef, useState } from "react";

/*
 * Store
 * */
import { useTabsStore } from "@/store/tabs.store";

/*
 * Helpers
 * */
// import { handleEventListener } from "@/helpers";

/*
 * Components
 * */
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { HydrationWrapper } from "@/components/HydrationWrapper";
import { GeneratedImages } from "@/components/GeneratedImages";

/*
 * Icons
 * */
import { LoaderCircle } from "lucide-react";
import { AppStateProvider } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks/AppContextProvider";

export default function Parent() {
  // handle hydration state
  const [isMounted, setIsMounted] = useState(false);
  const isComponentMounted = useRef(false);

  useEffect(() => {
    isComponentMounted.current = true;
    setIsMounted(true);

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  // handle active UI based on the active tab
  const { activeTab } = useTabsStore();

  // useEffect(() => {
  //   if (!isMounted) return;
  //
  //   // Async handler for incoming messages
  //   window.addEventListener("message", handleEventListener);
  //
  //   return () => {
  //     window.removeEventListener("message", handleEventListener);
  //   };
  // }, [isMounted]);

  if (!isMounted) {
    return (
      <main className="h-screen max-w-7xl mx-auto flex items-center justify-center">
        <LoaderCircle className="animate-spin" size={32} />
      </main>
    );
  }

  return (
    <AppStateProvider>
      <main className="max-w-7xl mx-auto py-10">
        {/*Tabs*/}
        <HydrationWrapper loadingSkeletonClasses="h-[50px] w-full">
          <TopBar />
        </HydrationWrapper>

        {activeTab === "Current" && (
          <div className="mt-8 mx-auto w-full grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-y-0 md:gap-x-4 lg:grid-cols-12">
            <div className="md:col-span-1 lg:col-span-4 relative z-50">
              <HydrationWrapper
                loadingSkeletonClasses="h-[500px] w-full"
                wrapperClasses="md:cols-1 lg:col-span-3"
              >
                <Sidebar />
              </HydrationWrapper>
            </div>

            <div className="md:col-span-2 lg:col-span-8 relative z-0">
              <HydrationWrapper
                loadingSkeletonClasses="h-[500px] w-full"
                wrapperClasses="md:cols-2 lg:col-span-9"
              >
                <GeneratedImages />
              </HydrationWrapper>
            </div>
          </div>
        )}
      </main>
    </AppStateProvider>
  );
}
