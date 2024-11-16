"use client";
/*
 * React & Next.js components
 * */
import React, { useContext, useEffect, useState } from "react";

/*
 * Hooks
 * */
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

/*
 * Types
 * */
import { TextElement } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Constants
 * */
import { FONT_FAMILY } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";

/*
 * Libs
 * */
import * as fabric from "fabric";

/*
 * Components
 * */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/*
 * Icons
 * */
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import Sketch from "@uiw/react-color-sketch";
import { SketchPicker } from "react-color";

export const MenuElementProperty = () => {
  const context = useContext(AppStateContext)!;
  const state = context.appState;
  const selectedElement = state.selectedElementId;
  const element = state.elements.find(
    (element) => element.id === selectedElement,
  );
  let render = null;
  switch (element?.type) {
    case "text": {
      render = <TextElementProperty editorElement={element as TextElement} />;
      break;
    }
    // case "ai-motif": {
    //     render = <AiMotifElementProperty editorElement={element as AiMotifElement} />;
    //     break;
    // }
  }
  if (render) {
    return <div className="element-property">{render}</div>;
  } else {
    return null;
  }
};

export type TextElementPropertyProps = {
  editorElement: TextElement;
};

export const TextElementProperty: React.FC<TextElementPropertyProps> = (
  props,
) => {
  const context = useContext(AppStateContext)!;
  // const { fontFamily, fontSize, textAlign, fontWeight } =
  //   props.editorElement.properties;
  const {
    color: originalColor,
    properties: { fontFamily, fontSize, textAlign, fontWeight },
  } = props.editorElement;
  const [inputFontSize, setInputFontSize] = useState(fontSize);
  const [displayColor, setDisplayColor] = useState(false);
  const [color, setColor] = useState("red");

  useEffect(() => {
    setColor(originalColor);
  }, [originalColor]);

  const handleSaveClick = () => {
    context.dispatch({
      type: "UPDATE_ELEMENT_PROPERTIES",
      id: props.editorElement.id,
      properties: {
        ...props.editorElement.properties,
        properties: {
          fontSize: inputFontSize,
        },
      },
      setSelection: true,
    });
  };

  useEffect(() => {
    setInputFontSize(fontSize);
  }, [fontSize]);

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) === 0) {
      setInputFontSize(1);
      return;
    }
    setInputFontSize(Number(event.target.value));
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-start items-center space-x-2">
        <h5 className="flex-1">Font weight:</h5>
        <ToggleGroup
          type="single"
          className="mt-1 self-start"
          defaultValue="normal"
        >
          <ToggleGroupItem
            value="normal"
            aria-label="normal"
            onClick={() => {
              context.dispatch({
                type: "UPDATE_ELEMENT_PROPERTIES",
                id: props.editorElement.id,
                properties: {
                  ...props.editorElement.properties,
                  properties: {
                    fontWeight: "normal",
                    text:
                      (props.editorElement.fabricObject as fabric.Text)?.text ??
                      props.editorElement.properties.text,
                  },
                },
                setSelection: true,
              });
            }}
          >
            Normal
          </ToggleGroupItem>

          <ToggleGroupItem
            value="bold"
            aria-label="bold"
            onClick={() => {
              context.dispatch({
                type: "UPDATE_ELEMENT_PROPERTIES",
                id: props.editorElement.id,
                properties: {
                  ...props.editorElement.properties,
                  properties: {
                    fontWeight: "bold",
                    text:
                      (props.editorElement.fabricObject as fabric.Text)?.text ??
                      props.editorElement.properties.text,
                  },
                },
                setSelection: true,
              });
            }}
          >
            Bold
          </ToggleGroupItem>
        </ToggleGroup>
        {/*<FaBold*/}
        {/*  style={{*/}
        {/*    background: fontWeight === "bold" ? "lightgrey" : "white",*/}
        {/*  }}*/}
        {/*  onClick={() => {*/}
        {/*    context.dispatch({*/}
        {/*      type: "UPDATE_ELEMENT_PROPERTIES",*/}
        {/*      id: props.editorElement.id,*/}
        {/*      properties: {*/}
        {/*        ...props.editorElement.properties,*/}
        {/*        properties: {*/}
        {/*          fontWeight: fontWeight === "bold" ? "normal" : "bold",*/}
        {/*          text:*/}
        {/*            (props.editorElement.fabricObject as fabric.Text)?.text ??*/}
        {/*            props.editorElement.properties.text,*/}
        {/*        },*/}
        {/*      },*/}
        {/*      setSelection: true,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
      <div className="flex justify-start items-center space-x-2 my-1">
        <h5 className="flex-1">Text alignment:</h5>
        <div className="flex space-x-1">
          <ToggleGroup
            type="single"
            className="mt-1 self-start"
            defaultValue="center"
          >
            <ToggleGroupItem
              value="left"
              aria-label="left"
              onClick={() => {
                context.dispatch({
                  type: "UPDATE_ELEMENT_PROPERTIES",
                  id: props.editorElement.id,
                  properties: {
                    ...props.editorElement.properties,
                    properties: {
                      textAlign: "left",
                      text:
                        (props.editorElement.fabricObject as fabric.Text)
                          ?.text ?? props.editorElement.properties.text,
                    },
                  },
                  setSelection: true,
                });
              }}
            >
              <AlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="center"
              aria-label="center"
              onClick={() => {
                context.dispatch({
                  type: "UPDATE_ELEMENT_PROPERTIES",
                  id: props.editorElement.id,
                  properties: {
                    ...props.editorElement.properties,
                    properties: {
                      textAlign: "center",
                      text:
                        (props.editorElement.fabricObject as fabric.Text)
                          ?.text ?? props.editorElement.properties.text,
                    },
                  },
                  setSelection: true,
                });
              }}
            >
              <AlignCenter />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="right"
              aria-label="right"
              onClick={() => {
                context.dispatch({
                  type: "UPDATE_ELEMENT_PROPERTIES",
                  id: props.editorElement.id,
                  properties: {
                    ...props.editorElement.properties,
                    properties: {
                      textAlign: "right",
                      text:
                        (props.editorElement.fabricObject as fabric.Text)
                          ?.text ?? props.editorElement.properties.text,
                    },
                  },
                  setSelection: true,
                });
              }}
            >
              <AlignRight />
            </ToggleGroupItem>
          </ToggleGroup>
          {/*{aligmnentOptions.map((alignment) => {*/}
          {/*  const Icon = ALIGNMENT_ICONS[alignment];*/}
          {/*  return (*/}
          {/*    <Icon*/}
          {/*      key={alignment}*/}
          {/*      style={{*/}
          {/*        background: textAlign === alignment ? "lightgrey" : "white",*/}
          {/*      }}*/}
          {/*      onClick={() => {*/}
          {/*        context.dispatch({*/}
          {/*          type: "UPDATE_ELEMENT_PROPERTIES",*/}
          {/*          id: props.editorElement.id,*/}
          {/*          properties: {*/}
          {/*            ...props.editorElement.properties,*/}
          {/*            properties: {*/}
          {/*              textAlign: alignment,*/}
          {/*              text:*/}
          {/*                (props.editorElement.fabricObject as fabric.Text)*/}
          {/*                  ?.text ?? props.editorElement.properties.text,*/}
          {/*            },*/}
          {/*          },*/}
          {/*          setSelection: true,*/}
          {/*        });*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}
        </div>
      </div>
      <div className="flex justify-start items-center space-x-2 my-1">
        <h5 className="flex-1">Font family:</h5>
        <div>
          <Select
            defaultValue="Open Sans"
            onValueChange={(value) => {
              context.dispatch({
                type: "UPDATE_ELEMENT_PROPERTIES",
                id: props.editorElement.id,
                properties: {
                  ...props.editorElement.properties,
                  properties: {
                    text:
                      (props.editorElement.fabricObject as fabric.Text)?.text ??
                      props.editorElement.properties.text,
                    fontFamily: value as any,
                  },
                },
                setSelection: true,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Open Sans" defaultValue="Open Sans" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILY.map((font) => (
                <SelectItem value={font} key={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/*<select*/}
        {/*  value={fontFamily}*/}
        {/*  onChange={(event) => {*/}
        {/*    context.dispatch({*/}
        {/*      type: "UPDATE_ELEMENT_PROPERTIES",*/}
        {/*      id: props.editorElement.id,*/}
        {/*      properties: {*/}
        {/*        ...props.editorElement.properties,*/}
        {/*        properties: {*/}
        {/*          text:*/}
        {/*            (props.editorElement.fabricObject as fabric.Text)?.text ??*/}
        {/*            props.editorElement.properties.text,*/}
        {/*          fontFamily: event.target.value as any,*/}
        {/*        },*/}
        {/*      },*/}
        {/*      setSelection: true,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {FONT_FAMILY.map((fontFamily) => {*/}
        {/*    return (*/}
        {/*      <option key={fontFamily} value={fontFamily}>*/}
        {/*        {fontFamily}*/}
        {/*      </option>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</select>*/}
      </div>

      <div className="flex justify-start items-center space-x-2 my-1">
        <div
          // style={{
          //   position: "relative",
          //   display: "flex",
          //   flexDirection: "column",
          //   alignItems: "center",
          //   justifyContent: "center",
          //   margin: "10px 0",
          //   gap: 10,
          // }}
          className="flex relative justify-between items-center w-full"
        >
          <div
            // style={{
            //   position: "relative",
            //   display: "flex",
            //   flexDirection: "row",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   margin: "10px 0",
            //   gap: 10,
            // }}
            className="flex w-full items-center justify-between"
          >
            <label>Color:</label>
            <div
              onClick={() => {
                setDisplayColor(!displayColor);
              }}
              className="w-8 h-8 rounded-sm cursor-pointer"
              style={{
                background: color,
              }}
            ></div>
          </div>
          {displayColor ? (
            <>
              <SketchPicker
                color={color}
                onChange={(color) => {
                  const fabricObject = props.editorElement.fabricObject;
                  if (fabricObject instanceof fabric.Text) {
                    setColor(color.hex);
                    fabricObject.set({ fill: color.hex });
                    fabricObject.dirty = true;
                    fabricObject.canvas?.requestRenderAll();
                  }
                  context.dispatch({
                    type: "UPDATE_ELEMENT_PROPERTIES",
                    id: props.editorElement.id,
                    properties: {
                      ...props.editorElement.properties,
                      color: color.hex,
                      properties: {
                        text:
                          (props.editorElement.fabricObject as fabric.Text)
                            ?.text ?? props.editorElement.properties.text,
                      },
                    },
                    setSelection: true,
                  });
                  // context.dispatch({
                  //   type: "UPDATE_EDITOR_PROPERTIES",
                  //   properties: { backgroundColor: color.hexa },
                  // });
                }}
                className="absolute z-[999999]"
              />
              {/*<Sketch*/}
              {/*  hidden={!displayColor}*/}
              {/*  disableAlpha*/}
              {/*  color={color}*/}
              {/*  onChange={(color) => {*/}
              {/*    const fabricObject = props.editorElement.fabricObject;*/}
              {/*    if (fabricObject instanceof fabric.Text) {*/}
              {/*      setColor(color.hex);*/}
              {/*      fabricObject.set({ fill: color.hex });*/}
              {/*      fabricObject.dirty = true;*/}
              {/*      fabricObject.canvas?.requestRenderAll();*/}
              {/*    }*/}
              {/*    context.dispatch({*/}
              {/*      type: "UPDATE_ELEMENT_PROPERTIES",*/}
              {/*      id: props.editorElement.id,*/}
              {/*      properties: {*/}
              {/*        ...props.editorElement.properties,*/}
              {/*        color: color.hex,*/}
              {/*        properties: {*/}
              {/*          text:*/}
              {/*            (props.editorElement.fabricObject as fabric.Text)*/}
              {/*              ?.text ?? props.editorElement.properties.text,*/}
              {/*        },*/}
              {/*      },*/}
              {/*      setSelection: true,*/}
              {/*    });*/}
              {/*    // context.dispatch({*/}
              {/*    //   type: "UPDATE_EDITOR_PROPERTIES",*/}
              {/*    //   properties: { backgroundColor: color.hexa },*/}
              {/*    // });*/}
              {/*  }}*/}
              {/*  onMouseLeave={() => {*/}
              {/*    setDisplayColor(!displayColor);*/}
              {/*  }}*/}
              {/*  className="absolute z-[999999]"*/}
              {/*/>*/}

              {/*<SketchPicker*/}
              {/*  disableAlpha*/}
              {/*  color={color}*/}
              {/*  className="absolute z-[999999]"*/}
              {/*  onChange={(color) => {*/}
              {/*    const fabricObject = props.editorElement.fabricObject;*/}
              {/*    if (fabricObject instanceof fabric.Text) {*/}
              {/*      setColor(color.hex);*/}
              {/*      fabricObject.set({ fill: color.hex });*/}
              {/*      fabricObject.dirty = true;*/}
              {/*      fabricObject.canvas?.requestRenderAll();*/}
              {/*    }*/}
              {/*  }}*/}
              {/*  onChangeComplete={(color) => {*/}
              {/*    context.dispatch({*/}
              {/*      type: "UPDATE_ELEMENT_PROPERTIES",*/}
              {/*      id: props.editorElement.id,*/}
              {/*      properties: {*/}
              {/*        ...props.editorElement.properties,*/}
              {/*        color: color.hex,*/}
              {/*        properties: {*/}
              {/*          text:*/}
              {/*            (props.editorElement.fabricObject as fabric.Text)*/}
              {/*              ?.text ?? props.editorElement.properties.text,*/}
              {/*        },*/}
              {/*      },*/}
              {/*      setSelection: true,*/}
              {/*    });*/}
              {/*  }}*/}
              {/*/>*/}
            </>
          ) : null}
        </div>
      </div>
      <div className="flex justify-start items-center space-x-2 my-1">
        <h5 className="flex-1">Font size:</h5>

        <div className="flex w-[63%] items-center space-x-3">
          <Input
            type="number"
            maxLength={3}
            value={inputFontSize.toFixed(0)}
            onChange={handleFontSizeChange}
          />
          <Button onClick={handleSaveClick}>Apply</Button>
          {/*<Select*/}
          {/*  defaultValue="20"*/}
          {/*  onValueChange={(value) => {*/}
          {/*    context.dispatch({*/}
          {/*      type: "UPDATE_ELEMENT_PROPERTIES",*/}
          {/*      id: props.editorElement.id,*/}
          {/*      properties: {*/}
          {/*        ...props.editorElement.properties,*/}
          {/*        properties: {*/}
          {/*          fontSize: parseInt(value),*/}
          {/*          text:*/}
          {/*            (props.editorElement.fabricObject as fabric.Text)?.text ??*/}
          {/*            props.editorElement.properties.text,*/}
          {/*        },*/}
          {/*      },*/}
          {/*      setSelection: true,*/}
          {/*    });*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <SelectTrigger className="w-[180px]">*/}
          {/*    <SelectValue placeholder="20" defaultValue="20" />*/}
          {/*  </SelectTrigger>*/}
          {/*  <SelectContent>*/}
          {/*    {FONT_SIZES.map((size) => (*/}
          {/*      <SelectItem value={`${size}`} key={size}>*/}
          {/*        {size}*/}
          {/*      </SelectItem>*/}
          {/*    ))}*/}
          {/*  </SelectContent>*/}
          {/*</Select>*/}
        </div>

        {/*<select*/}
        {/*  value={fontSize}*/}
        {/*  onChange={(event) => {*/}
        {/*    context.dispatch({*/}
        {/*      type: "UPDATE_ELEMENT_PROPERTIES",*/}
        {/*      id: props.editorElement.id,*/}
        {/*      properties: {*/}
        {/*        ...props.editorElement.properties,*/}
        {/*        properties: {*/}
        {/*          fontSize: parseInt(event.target.value),*/}
        {/*          text:*/}
        {/*            (props.editorElement.fabricObject as fabric.Text)?.text ??*/}
        {/*            props.editorElement.properties.text,*/}
        {/*        },*/}
        {/*      },*/}
        {/*      setSelection: true,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {FONT_SIZES.map((fontSize) => {*/}
        {/*    return (*/}
        {/*      <option key={fontSize} value={fontSize}>*/}
        {/*        {fontSize}*/}
        {/*      </option>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</select>*/}
      </div>
    </div>
  );
};

// AiMotifElementProperty with prompt and generate button

// export type AiMotifElementPropertyProps = {
//     editorElement: AiMotifElement;
// };

// export const AiMotifElementProperty: React.FC<AiMotifElementPropertyProps> = (props) => {
//     const context = useContext(AppStateContext)!;
//     const { prompt } = props.editorElement.properties;
//     const [text, setText] = useState(prompt);
//     const [isGenerating, setIsGenerating] = useState(false);

//     return (
//         <div className="ai-motif-element-property">
//             <div>
//                 <label>Prompt</label>
//                 <input
//                     type="text"
//                     disabled={isGenerating}
//                     value={text}
//                     placeholder="Create a red flower"
//                     onChange={(event) => {
//                         if (!isGenerating)
//                             setText(event.target.value);
//                     }}
//                 />
//             </div>
//             <div>
//                 <button
//                     disabled={isGenerating}
//                     onClick={async () => {
//                         setIsGenerating(true);
//                         const result = await AiGenerateRequest(text);

//                         const img = await convertToImageAsync(result);

//                         context.dispatch({
//                             type: 'UPDATE_ELEMENT_PROPERTIES',
//                             id: props.editorElement.id,
//                             properties: {
//                                 ...props.editorElement.properties,
//                                 properties: {
//                                     imgElement: img,
//                                     prompt: text,
//                                 }
//                             },
//                             setSelection: true,
//                         });
//                     }}
//                 >
//                     Generate
//                 </button>
//             </div>
//         </div>
//     );
// }
