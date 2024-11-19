/*
 * React & Next.js component
 * */
import React from "react";

/*
 * UI Components
 * */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

export const DashboardErrorModal = () => {
  const { showErrorModal, setShowErrorModal, errorModalMessage } =
    useDashboardStore();

  return (
    <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            {errorModalMessage.header}
          </DialogTitle>
          <DialogDescription className="text-center text-black/90">
            <span
              dangerouslySetInnerHTML={{ __html: errorModalMessage.body! }}
            ></span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
