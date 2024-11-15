"use client";

/*
 * React & Next.js component
 * */
import React, { useEffect, useState } from "react";

/*
 * Modals
 * */
import { DashboardErrorModal } from "@/components/GlobalUI/Modals/DashboardErrorModal";
import { StylesModal } from "@/components/GlobalUI/Modals/StylesModal";
import { UploadModal } from "@/components/GlobalUI/Modals/UploadModal";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useUploadImagesModal } from "@/store/uploadImages.store";

export const ModalProvider = () => {
  // handle hydration state
  const [isMounted, setIsMounted] = useState(false);

  const { showErrorModal, openStylesModal } = useDashboardStore();
  const { isUploadImagesModalOpen } = useUploadImagesModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {showErrorModal && <DashboardErrorModal />}{" "}
      {openStylesModal && <StylesModal />}
      {isUploadImagesModalOpen && <UploadModal />}
    </>
  );
};
