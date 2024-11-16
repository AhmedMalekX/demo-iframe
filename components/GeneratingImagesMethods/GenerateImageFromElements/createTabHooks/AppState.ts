import { createGuid } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";
import {
  EditorElement,
  ImageElement,
  offset,
  Placements,
  Position,
  Size,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";
import { CONFIG } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";
import * as fabric from "fabric";

export type AppState = {
  elements: EditorElement[];
  spacing: number;
  selectedElementId: string | null;
  backgroundColor: string;
  patternOffset: offset;
  placement: Placements;
  debug: boolean;
  maxLimitOfObjectSize: number;
};
export type AppStateAction =
  | { type: "ADD_ELEMENT"; element: EditorElement }
  | { type: "DELETE_ELEMENT"; id: string }
  | {
      type: "CHANGE_SPACING";
      sizePosition: { size: Size; position: Position }[];
      spacing: number;
    }
  | {
      type: "REORDER_ELEMENTS";
      elements: EditorElement[];
      selectedElement: string;
    }
  | { type: "SELECT_ELEMENT"; id: string | null; newPosition?: Position }
  | {
      type: "UPDATE_ELEMENT_PROPERTIES";
      id: string;
      properties: Partial<EditorElement>;
      setSelection?: boolean;
    }
  | {
      type: "FLIP_SELECTED_ELEMENT";
      invertFlipX: boolean;
      invertFlipY: boolean;
    }
  | { type: "ADD_RECT_ELEMENT" }
  | { type: "ADD_CIRCLE_ELEMENT" }
  | { type: "ADD_IMAGE_ELEMENT"; imgElement: HTMLImageElement; src: string }
  | { type: "ADD_TEXT_ELEMENT"; text: string }
  | { type: "ADD_AI_MOTIF_ELEMENT"; imgElement: HTMLImageElement; src: string }
  | { type: "CONVERT_SELECTED_AI_IMAGE_TO_NORMAL_IMAGE" }
  | { type: "DUPLICATE_ELEMENT"; id: string }
  | { type: "SEND_ELEMENT_BACKWARDS" }
  | { type: "SEND_ELEMENT_FORWARDS" }
  | {
      type: "UPDATE_EDITOR_PROPERTIES";
      properties: Partial<Omit<AppState, "elements" | "selectedElementId">>;
    };

// const modifyElements = async (elements: EditorElement[]) => {
//   return await Promise.all(
//     elements.map((e) => {
//       const eMinusFabricObject =
//         AppStateUtils.RemoveFabricObjectsFromEditorElement(e);
//       return AppStateUtils.RemoveHtmlElementsFromEditorElement(
//         eMinusFabricObject,
//       );
//     }),
//   );
// };

export function appStateReducer(
  state: AppState,
  action: AppStateAction,
): AppState {
  state = StateUtils.UpdateSelectedTextElementTextPropertyIfNotSaved(state);
  switch (action.type) {
    case "UPDATE_EDITOR_PROPERTIES": {
      const newState = {
        ...state,
        ...action.properties,
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error update editor properties.");
      //   });

      return newState;
    }
    case "ADD_ELEMENT": {
      const newState: AppState = {
        ...state,
        elements: [...state.elements, action.element],
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error add element to create tab editor.");
      //   });

      return appStateReducer(newState, {
        type: "SELECT_ELEMENT",
        id: action.element.id,
        newPosition: action.element.position,
      });
    }
    case "DELETE_ELEMENT": {
      const newState = {
        ...state,
        elements: state.elements.filter((e) => e.id !== action.id),
        selectedElementId: null,
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error delete element in create tab editor.");
      //   });

      return newState;
    }
    case "REORDER_ELEMENTS": {
      const newState = {
        ...state,
        elements: action.elements,
        selectedElementId: action.selectedElement,
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch((error) => {
      //     console.log("Error reorder element to create tab editor.");
      //   });

      return newState;
    }
    case "SELECT_ELEMENT": {
      const newElement = state.elements.find((e) => e.id === action.id);
      // let previousSelectionElement = state.elements.find(e => e.id === state.selectedElementId);

      // If the same is selected then do nothing
      if (
        state.selectedElementId === action.id &&
        action.newPosition?.top === newElement?.position.top &&
        action.newPosition?.left === newElement?.position.left
      ) {
        return state;
      }

      // Handle AI Logic to keep or remove
      const stateToWorkWith = StateUtils.UpdateSelectionIdWithAiLogicAppState(
        state,
        action.id,
      );

      const newState = {
        ...stateToWorkWith,
        selectedElementId: action.id,
        elements: stateToWorkWith.elements.map((e) => {
          if (e.id === action.id) {
            return {
              ...e,
              position: action.newPosition ?? e.position,
            };
          }
          return e;
        }),
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error select element in create tab editor.");
      //   });

      return newState;
    }
    case "UPDATE_ELEMENT_PROPERTIES": {
      const map: (e: EditorElement) => EditorElement = (e) => {
        if (e.type === "image" && action.properties.size) {
          e.imgElement!.width = action.properties.size.width;
          e.imgElement!.height = action.properties.size.height;
        }
        if (e.id === action.id) {
          if (action.properties.size) {
            const currentSize = e.size;
            const currentAspectRatio = currentSize.width / currentSize.height;
            const newAspectRatio =
              action.properties.size.width / action.properties.size.height;
            const maxSize = {
              width: state.patternOffset.x * state.maxLimitOfObjectSize,
              height: state.patternOffset.y * state.maxLimitOfObjectSize,
            };
            if (currentAspectRatio !== newAspectRatio) {
              action.properties.size.width = Math.min(
                action.properties.size.width,
                maxSize.width,
              );
              action.properties.size.height = Math.min(
                action.properties.size.height,
                maxSize.height,
              );
            } else {
              const aspectRatio =
                action.properties.size.width / action.properties.size.height;
              if (action.properties.size.width > maxSize.width) {
                action.properties.size.width = maxSize.width;
                action.properties.size.height =
                  action.properties.size.width / aspectRatio;
              } else if (action.properties.size.height > maxSize.height) {
                action.properties.size.height = maxSize.height;
                action.properties.size.width =
                  action.properties.size.height * aspectRatio;
              }
            }
          }

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const newElement: EditorElement = {
            ...e,
            ...action.properties,
            properties: {
              ...e.properties,
              ...action.properties.properties,
            },
          };
          return newElement;
        }
        return e;
      };
      const elements: EditorElement[] = state.elements.map(map);
      let newState = {
        ...state,
        elements,
      };
      if (action.setSelection) {
        newState = appStateReducer(newState, {
          type: "SELECT_ELEMENT",
          id: action.id,
        });
      }

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error update element properties to create tab editor.");
      //   });

      return newState;
      // Todo
      // const updatedState = appStateReducer(state, { type: 'SET', newState });
      // // Handle AI Logic
      // return updatedState;
      // // return StateUtils.UpdateSelectionIdWithAiLogicUndoRedo(updatedState, action.id);
    }

    case "FLIP_SELECTED_ELEMENT": {
      const map: (e: EditorElement) => EditorElement = (e) => {
        if (e.id === state.selectedElementId) {
          return {
            ...e,
            flipX: action.invertFlipX ? !e.flipX : e.flipX,
            flipY: action.invertFlipY ? !e.flipY : e.flipY,
          };
        }
        return e;
      };
      const elements: EditorElement[] = state.elements.map(map);
      const newState = {
        ...state,
        elements,
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error flip element in create tab editor.");
      //   });

      return newState;
      // return appStateReducer(state, { type: 'SET', newState });
    }

    case "ADD_RECT_ELEMENT": {
      const newElement: EditorElement = {
        id: createGuid(),
        size: {
          width: 40,
          height: 40,
        },
        position: {
          top: 100,
          left: 100,
        },
        flipX: false,
        flipY: false,
        rotation: 0,
        type: "rect",
        color: "#FF5C5C",
        opacity: 1,
        properties: {},
      };
      return appStateReducer(state, {
        type: "ADD_ELEMENT",
        element: newElement,
      });
    }
    case "ADD_CIRCLE_ELEMENT": {
      const newElement: EditorElement = {
        id: createGuid(),
        size: {
          width: 40,
          height: 40,
        },
        position: {
          top: 100,
          left: 100,
        },
        flipX: false,
        flipY: false,
        rotation: 0,
        type: "circle",
        color: "#00B4DB",
        opacity: 1,
        properties: {},
      };
      return appStateReducer(state, {
        type: "ADD_ELEMENT",
        element: newElement,
      });
    }
    case "ADD_IMAGE_ELEMENT": {
      const newElement: EditorElement = {
        id: createGuid(),
        imgElement: action.imgElement,
        size: {
          width: action.imgElement.width,
          height: action.imgElement.height,
        },
        position: {
          top: 100,
          left: 100,
        },
        flipX: false,
        flipY: false,
        rotation: 0,
        type: "image",
        color: "#333",
        opacity: 1,
        properties: {
          src: action.src,
        },
      };
      return appStateReducer(state, {
        type: "ADD_ELEMENT",
        element: newElement,
      });
    }
    case "ADD_AI_MOTIF_ELEMENT": {
      const newElement: EditorElement = {
        id: createGuid(),
        size: {
          width: 100,
          height: 100,
        },
        position: {
          top: 100,
          left: 100,
        },
        flipX: false,
        flipY: false,
        rotation: 0,
        type: "ai-motif",
        color: "#333",
        opacity: 1,
        properties: {
          imgElement: action.imgElement,
          prompt: "",
          status: "prompt",
          generatedCount: 0,
          src: action.src,
        },
      };
      return appStateReducer(state, {
        type: "ADD_ELEMENT",
        element: newElement,
      });
    }
    case "ADD_TEXT_ELEMENT": {
      const newElement: EditorElement = {
        id: createGuid(),
        properties: {
          text: action.text,
          fontSize: 20,
          fontFamily: "Open Sans",
          fontWeight: "normal",
          fontStyle: "normal",
          textAlign: "center",
          // fontFamily: 'Arial',
        },
        size: {
          width: 100,
          height: 40,
        },
        position: {
          top: 100,
          left: 100,
        },
        flipX: false,
        flipY: false,
        rotation: 0,
        type: "text",
        color: "#333",
        opacity: 1,
      };
      return appStateReducer(state, {
        type: "ADD_ELEMENT",
        element: newElement,
      });
    }
    case "CONVERT_SELECTED_AI_IMAGE_TO_NORMAL_IMAGE": {
      const selectedElement = state.elements.find(
        (e) => e.id === state.selectedElementId,
      )!;
      if (selectedElement.type !== "ai-motif") return state;
      const stateAfterDelete = appStateReducer(state, {
        type: "DELETE_ELEMENT",
        id: selectedElement.id,
      });
      const imgElement = selectedElement.properties.imgElement;
      const newId = createGuid();
      const newImageElement: ImageElement = {
        id: newId,
        imgElement: imgElement,
        size: {
          width: selectedElement.size.width,
          height: selectedElement.size.height,
        },
        position: {
          top: selectedElement.position.top,
          left: selectedElement.position.left,
        },
        flipX: false,
        flipY: false,
        rotation: selectedElement.rotation,
        type: "image",
        color: "#333",
        opacity: 1,
        properties: {
          src: selectedElement.properties.src,
        },
      };
      const stateAfterAdd = appStateReducer(stateAfterDelete, {
        type: "ADD_ELEMENT",
        element: newImageElement,
      });
      return stateAfterAdd;
    }
    case "DUPLICATE_ELEMENT": {
      const element = state.elements.find((e) => e.id === action.id)!;
      const newElement: EditorElement = {
        ...element,
        id: createGuid(),
        position: {
          top: element.position.top + 10,
          left: element.position.left + 10,
        },
      };
      return appStateReducer(state, {
        type: "ADD_ELEMENT",
        element: newElement,
      });
    }
    case "SEND_ELEMENT_BACKWARDS": {
      const selectedElement = state.selectedElementId;
      if (!selectedElement) return state;
      const elements = [...state.elements];
      const idx = elements.findIndex((e) => e.id === selectedElement);
      if (idx === -1) return state;
      if (idx === 0) return state;
      const [element] = elements.splice(idx, 1);
      elements.splice(idx - 1, 0, element);
      const newState = {
        ...state,
        elements,
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error send element backwards in create tab editor.");
      //   });

      return newState;
    }

    case "SEND_ELEMENT_FORWARDS": {
      const selectedElement = state.selectedElementId;
      if (!selectedElement) return state;
      const elements = [...state.elements];
      const idx = elements.findIndex((e) => e.id === selectedElement);
      if (idx === -1) return state;
      if (idx === elements.length - 1) return state;
      const [element] = elements.splice(idx, 1);
      elements.splice(idx + 1, 0, element);
      const newState = {
        ...state,
        elements,
      };

      // modifyElements(newState.elements)
      //   .then((result) => {
      //     const tempState = { ...newState, elements: result };
      //
      //     if (typeof window !== "undefined" && window.indexedDB) {
      //       import("@/utils/indexdb").then(({ updateIndexDBRecord }) => {
      //         updateIndexDBRecord(tempState)
      //           .then(() => console.log("IndexedDB updated successfully"))
      //           .catch((error) =>
      //             console.error("Error updating IndexedDB:", error),
      //           );
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Error send element forwards in create tab editor.");
      //   });

      return newState;
    }

    case "CHANGE_SPACING": {
      return {
        ...state,
        spacing: action.spacing,
        elements: state.elements.map((e, index) => {
          const sizePosition = action.sizePosition[index];
          if (e.type === "text") {
            // We will scale size, and then we will scale the font size as well
            const newSpacingRatio = action.spacing / state.spacing;
            const scaledFontSize = e.properties.fontSize * newSpacingRatio;
            return {
              ...e,
              size: sizePosition.size,
              position: sizePosition.position,
              properties: {
                ...e.properties,
                fontSize: scaledFontSize,
              },
            };
          } else {
            return {
              ...e,
              size: sizePosition.size,
              position: sizePosition.position,
            };
          }
        }),
      };
    }

    default: {
      return state;
    }
  }
}

export class StateUtils {
  static UpdateSelectionIdWithAiLogicAppState(
    state: AppState,
    id: string | null,
  ): AppState {
    const previousSelectionElement = state.elements.find(
      (e) => e.id === state.selectedElementId,
    );
    const newElement = state.elements.find((e) => e.id === id);

    const previousAiElement =
      previousSelectionElement?.type === "ai-motif"
        ? previousSelectionElement
        : null;

    if (!previousAiElement) {
      return state;
    }
    if (previousAiElement.id === newElement?.id) {
      return state;
    }
    if (previousAiElement.properties.status === "generating") {
      return state;
    } else if (previousAiElement.properties.generatedCount > 0) {
      return appStateReducer(state, {
        type: "CONVERT_SELECTED_AI_IMAGE_TO_NORMAL_IMAGE",
      });
    } else {
      return appStateReducer(state, {
        type: "DELETE_ELEMENT",
        id: previousAiElement.id,
      });
    }
  }

  static UpdateSelectedTextElementTextPropertyIfNotSaved(
    state: AppState,
  ): AppState {
    const selectedElement = state.elements.find(
      (e) => e.id === state.selectedElementId,
    );
    if (selectedElement?.type === "text") {
      const fabricObject = selectedElement.fabricObject;
      if (!fabricObject) return state;
      if (!(fabricObject instanceof fabric.Textbox)) return state;
      const inEditingMode = fabricObject.isEditing;
      if (!inEditingMode) return state;
      if (fabricObject.text === selectedElement.properties.text) return state;
      return <AppState>{
        ...state,
        elements: state.elements.map((e) => {
          if (e.id === selectedElement.id) {
            return {
              ...e,
              properties: {
                ...e.properties,
                text: fabricObject.text,
              },
            };
          }
          return e;
        }),
      };
    }
    return state;
  }
}

export class AppStateUtils {
  static GetInitialState(): AppState {
    return {
      elements: [],
      spacing: 1,
      selectedElementId: null,
      backgroundColor: "#ffffff",
      patternOffset: CONFIG.STARTING_CORE_CANVAS_SIZE,
      placement: "full-drop",
      debug: false,
      maxLimitOfObjectSize: 1,
    };
  }

  static ConvertStateToJsonString(state: AppState): string {
    // filter out fabric objects and ImageElements
    const elements = state.elements.map((e) => {
      const eMinusFabricObject =
        AppStateUtils.RemoveFabricObjectsFromEditorElement(e);
      return AppStateUtils.RemoveHtmlElementsFromEditorElement(
        eMinusFabricObject,
      );
    });
    return JSON.stringify({
      ...state,
      elements,
    });
  }

  static async ConvertJsonStringToState(jsonString: string): Promise<AppState> {
    // We have to create each image element asynchrounously then resolve them with Promise.all
    // and then create the state
    const json = JSON.parse(jsonString);
    const elementsPromises: Promise<never>[] = json.elements.map((e: never) =>
      AppStateUtils.CreateElementFromJson(e),
    );
    const elements = await Promise.all(elementsPromises);
    return {
      ...json,
      elements,
    };
  }

  static async CreateElementFromJson(
    json: Partial<EditorElement>,
  ): Promise<EditorElement> {
    if (json.type === "image") {
      const imgElement = new Image();
      if (!json.properties)
        throw new Error("Image element must have properties");
      imgElement.src = json.properties.src;
      return new Promise((resolve) => {
        imgElement.onload = () => {
          resolve({
            ...json,
            imgElement,
          } as never);
        };
      });
    } else if (json.type === "ai-motif") {
      const imgElement = new Image();
      if (!json.properties)
        throw new Error("AI Motif element must have properties");
      imgElement.src = json.properties.src;
      return new Promise((resolve) => {
        imgElement.onload = () => {
          resolve({
            ...json,
            properties: {
              ...json.properties,
              imgElement,
            },
          } as never);
        };
      });
    }
    return Promise.resolve(json as EditorElement);
  }

  static RemoveFabricObjectsFromEditorElement(element: EditorElement) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fabricObject, ...rest } = element;
    return rest;
  }

  static RemoveHtmlElementsFromEditorElement(element: EditorElement) {
    switch (element.type) {
      case "image": {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { imgElement, ...restImageElement } = element;
        return restImageElement;
      }
      case "ai-motif": {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { imgElement, ...restImageElement } = element.properties;
        return {
          ...element,
          properties: {
            ...restImageElement,
          },
        };
      }
      default: {
        return element;
      }
    }
  }
}
