import React, { useReducer } from "react";
import {
  AppStateAction,
  appStateReducer,
  AppState as AppStateInner,
  AppStateUtils,
} from "./AppState";
import { EditorElement } from "@/app/(routes)/dashboard/_createTab/_Engine/types";
import { Object as FabricObject } from "fabric";

// type AppState  = AppState;

export type AppState = AppStateInner;

type UndoRedoState = {
  past: AppStateInner[];
  present: AppStateInner;
  future: AppStateInner[];
};

export type Action =
  | { type: "RESET_TO"; state: AppStateInner }
  | { type: "SET"; newState: AppStateInner }
  | { type: "UNDO" }
  | { type: "REDO" }
  | AppStateAction;

function undoRedoReducer(state: UndoRedoState, action: Action): UndoRedoState {
  switch (action.type) {
    case "RESET_TO": {
      return {
        past: [],
        present: StateNormaliser.Normalize(action.state),
        future: [],
      };
    }
    case "UNDO": {
      const [newPresent, ...newPast] = state.past;
      return {
        past: newPast,
        present: StateNormaliser.Normalize(newPresent),
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      const [nextPresent, ...newFuture] = state.future;
      return {
        past: [state.present, ...state.past],
        present: StateNormaliser.Normalize(nextPresent),
        future: newFuture,
      };
    }
    case "SET": {
      return {
        past: [state.present, ...state.past],
        present: action.newState,
        future: [],
      };
    }
    default: {
      const newAppState = appStateReducer(state.present, action);
      if (newAppState === state.present) {
        return state;
      } else if (
        StateNormaliser.DeepCompareStates(
          StateNormaliser.Normalize(newAppState),
          StateNormaliser.Normalize(state.present),
        )
      ) {
        return {
          past: state.past,
          present: newAppState,
          future: [],
        };
      } else {
        return undoRedoReducer(state, { type: "SET", newState: newAppState });
      }
    }
  }
}

export class StateNormaliser {
  static DeepRecusriveCompare(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }
    if (a instanceof FabricObject && b instanceof FabricObject) {
      return true;
    }
    if (a instanceof Image && b instanceof Image) {
      return a.src === b.src;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a !== "object") {
      return false;
    }
    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      return a.every((v, i) => StateNormaliser.DeepRecusriveCompare(v, b[i]));
    }
    if (a === null || b === null) {
      return false;
    }
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    return Object.keys(a).every((k) =>
      StateNormaliser.DeepRecusriveCompare(a[k], b[k]),
    );
  }

  static DeepCompareStates(
    state1: AppStateInner,
    state2: AppStateInner,
  ): boolean {
    const result = StateNormaliser.DeepRecusriveCompare(state1, state2);
    return result;
  }
  static Normalize(state: AppStateInner): AppStateInner {
    return {
      ...state,
      elements: state.elements
        .filter(StateNormaliser.Filter)
        .map(StateNormaliser.Map),
    };
  }

  static Filter(element: EditorElement): boolean {
    if (element.type === "ai-motif") {
      return element.properties.generatedCount > 0;
    } else {
      return true;
    }
  }

  // Convert AI_MOTIF to IMAGE
  static Map(element: EditorElement): EditorElement {
    if (element.type === "ai-motif") {
      // return element;
      return {
        ...element,
        properties: {
          ...element.properties,
          status: "prompt",
        },
      };
      // return {
      //     ...element,
      //     type: 'image',
      //     imgElement: element.properties.imgElement,
      //     // src: element.properties.src,
      //     properties: {
      //         ...element.properties,
      //     }
      // }
    } else {
      return element;
    }
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(undoRedoReducer, void 0, () => {
    return {
      past: [],
      present: AppStateUtils.GetInitialState(),
      future: [],
    };
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const appState = state.present;

  const selectedElementId = appState.selectedElementId;
  const elementIndex = selectedElementId
    ? appState.elements.findIndex((e) => e.id === selectedElementId)
    : -1;
  const canSendBackwards = elementIndex > 0 && elementIndex !== -1;
  const canSendForwards =
    elementIndex < appState.elements.length - 1 && elementIndex !== -1;

  return {
    dispatch,
    appState,
    canRedo,
    canUndo,
    canSendBackwards,
    canSendForwards,
  };
}

export const AppStateContext = React.createContext<ReturnType<
  typeof useAppState
> | null>(null);
