"use client";

/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useRef, useState } from "react";

/*
 * UI Components
 * */
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Types
 * */
interface HydrationWrapperProps {
  children: React.ReactNode;
  wrapperClasses?: string;
  loadingSkeletonClasses?: string;
}

export const HydrationWrapper = ({
  children,
  wrapperClasses,
  loadingSkeletonClasses,
}: HydrationWrapperProps) => {
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

  if (!isMounted) {
    return (
      <div className={cn(wrapperClasses)}>
        <Skeleton className={cn(loadingSkeletonClasses)} />
      </div>
    );
  }

  return <div className={cn(wrapperClasses)}>{children}</div>;
};
