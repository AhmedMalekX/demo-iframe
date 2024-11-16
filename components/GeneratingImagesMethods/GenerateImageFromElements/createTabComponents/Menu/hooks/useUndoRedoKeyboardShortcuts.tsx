import { useContext, useEffect } from "react";
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

export const useUndoRedoKeyboardShortcuts = () => {
  const context = useContext(AppStateContext)!;
  const { appState, canRedo, canUndo, dispatch } = context;
  useEffect(() => {
    const keyboardListener = (evt: KeyboardEvent) => {
      evt.stopImmediatePropagation();
      if (evt.key === "z" && (evt.ctrlKey || evt.metaKey) && evt.shiftKey) {
        // handle redo action
        if (canRedo) {
          dispatch({ type: "REDO" });
        }
        evt.preventDefault();
        evt.stopImmediatePropagation();
      } else if (evt.key === "z" && (evt.ctrlKey || evt.metaKey)) {
        // handle undo action
        if (canUndo) {
          dispatch({ type: "UNDO" });
        }
        evt.preventDefault();
        evt.stopImmediatePropagation();
      } else if (evt.key === "Delete") {
        const activeElementId = appState.selectedElementId;
        if (activeElementId) {
          dispatch({ type: "DELETE_ELEMENT", id: activeElementId });
          evt.preventDefault();
          evt.stopImmediatePropagation();
        }
      }
    };
    window.addEventListener("keydown", keyboardListener);
    return () => {
      window.removeEventListener("keydown", keyboardListener);
    };
  }, [canRedo, canUndo, appState, dispatch]);
};
