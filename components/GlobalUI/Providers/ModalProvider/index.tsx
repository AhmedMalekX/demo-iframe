"use client";

/*
 * React & Next.js component
 * */
import { useEffect, useState } from "react";

/*
 * Modals
 * */
import { DashboardErrorModal } from "@/components/GlobalUI/Modals/DashboardErrorModal";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

export const ModalProvider = () => {
  // handle hydration state
  const [isMounted, setIsMounted] = useState(false);

  const { showErrorModal } = useDashboardStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <>{showErrorModal && <DashboardErrorModal />}</>;
};
