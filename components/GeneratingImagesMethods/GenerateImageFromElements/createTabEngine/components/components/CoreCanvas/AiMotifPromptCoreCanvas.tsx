"use client";

/*
 * React & Next.js components
 */
import React, { useContext, useEffect, useState } from "react";

/*
 * Hooks
 */
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

/*
 * Types
 */
import { AiMotifElement } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Style
 */
import "./AiMotifPromptCoreCanvas.css";

/*
 * Utils
 */
import { convertImageToBase64 } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic/utils/imageToDataUrl";

/*
 * Icons
 */
import { CircleCheck, Coins, LoaderCircle, Shuffle } from "lucide-react";

/*
 * Actions
 */
import { getTransparentMotifsId } from "@/actions/getTransparentMotifsId";

/*
 * Helpers
 */
import { getTransparentMotifsData } from "@/helpers/getTransparentMotifsData";

/*
 * Stores
 */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * Components
 */
import { Button } from "@/components/ui/button";

export interface AiMotifPromptCoreCanvasProps {
  element: AiMotifElement;
}

// temp prompts
const imagePrompts = [
  "a playful puppy",
  "corgi",
  "a majestic eagle soaring",
  "an owl",
  "squirrel",
  "a chameleon changing colors",
  "deer",
  "a colorful parrot perched on a branch",
  "a goldfish in a bowl",
  "lion",
  "koala",
  "horse running in a field",
  "butterfly",
  "bear",
];

function getRandomPrompt(prompts: string[]) {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

export const AiMotifPromptCoreCanvas: React.FC<
  AiMotifPromptCoreCanvasProps
> = ({ element }) => {
  const {
    setErrorModalMessage,
    setShowErrorModal,
    generatingMotif,
    setGeneratingMotif,
  } = useDashboardStore();
  const appContext = useContext(AppStateContext)!;
  const { dispatch } = appContext;
  const id = element.id;
  const isGenerating = element.properties.status === "generating";
  const [prompt, setPrompt] = useState(element.properties.prompt);
  // const canClickDone = element.properties.status !== 'prompt';
  const canClickDone = element.properties.status === "done";

  useEffect(() => {
    setPrompt(getRandomPrompt(imagePrompts));
  }, []);

  const handleDoneClick = () => {
    dispatch({
      type: "CONVERT_SELECTED_AI_IMAGE_TO_NORMAL_IMAGE",
    });
  };

  const handleGenerateClick = async () => {
    if (typeof window === "undefined") return;
    // show error popup
    if (!prompt) return;
    try {
      dispatch({
        type: "UPDATE_ELEMENT_PROPERTIES",
        id: id,
        properties: {
          properties: {
            ...element.properties,
            prompt: prompt,
            status: "generating",
          },
        },
        setSelection: true,
      });

      setGeneratingMotif(true);

      // get transparent motif id

      const motifId = await getTransparentMotifsId({
        id: "",
        prompt,
      });

      if (motifId?.message?.startsWith("Not enough credits")) {
        setErrorModalMessage({
          header: "You don't have enough credits",
          body: 'Upgrade your subscription or top up your credit from <a href="/pricing" target="_blank" class="underline">here.</a>',
        });
        setShowErrorModal(true);
        setGeneratingMotif(false);
        return;
      }

      if (motifId?.message) {
        setErrorModalMessage({
          header: "Error",
          body: motifId.message,
        });
        setShowErrorModal(true);
        setGeneratingMotif(false);
        return;
      }

      // get transparent motif data
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const motifData: {
        message: string;
        status: number;
        data: { images: { url: string }[] };
      } = await getTransparentMotifsData({
        numberOfCredits: 1,
        generationId: motifId,
        userId: "",
      });

      if (motifData?.status === 500) {
        setErrorModalMessage({
          header: "Invalid data error",
          body: "Something went wrong, try again No credits were deducted for this request.",
        });
        setShowErrorModal(true);
        setGeneratingMotif(false);
        return;
      }

      // update user credits
      // setUser({
      //   ...user,
      //   credit: motifData.data.userCredits,
      //   subscriptionCredits: motifData.data.userSubscriptionCredits,
      //   usedCredits: motifData.data.usedCredits,
      // });

      // add motif
      const image = new window.Image();
      image.crossOrigin = "Anonymous";
      image.src = motifData.data.images[0].url;
      image.onload = () => {
        try {
          dispatch({
            type: "UPDATE_ELEMENT_PROPERTIES",
            id: id,
            properties: {
              properties: {
                ...element.properties,
                imgElement: image,
                src: convertImageToBase64(image),
                prompt: prompt,
                status: "done",
                generatedCount: element.properties.generatedCount + 1,
              },
            },
            // IGNORE_STATE_SAVE: true,
            setSelection: true,
          });
        } catch (error) {
          console.error({ error });
        } finally {
          setGeneratingMotif(false);
        }
      };
    } catch (error) {
      console.log({ error });
      setGeneratingMotif(false);

      setErrorModalMessage({
        header: "Invalid data error",
        body: "Something went wrong, try again No credits were deducted for this request.",
      });
      setShowErrorModal(true);
      setGeneratingMotif(false);
      return;
    }
  };

  const handleAddMotifs = async () => {
    if (typeof window === "undefined") return;
    // show error popup
    // if (!user?.uid) return;

    setPrompt(getRandomPrompt(imagePrompts));
  };

  return (
    <div className="AiMotifPromptCoreCanvas flex !flex-col w-[200px] space-y-1.5 absolute z-[999999999999]">
      <input
        type="textarea"
        disabled={generatingMotif}
        value={prompt}
        style={{ fontSize: 10 }}
        placeholder="Prompt"
        className="w-full"
        autoFocus
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
        onChange={(event) => {
          if (!isGenerating) {
            const value = event.target.value;
            setPrompt(value);
            // dispatch({
            //     type: 'UPDATE_ELEMENT_PROPERTIES',
            //     id: id,
            //     properties: {
            //         properties: {
            //             ...element.properties,
            //             prompt: value,
            //         }
            //     },
            //     setSelection: true,
            // });
          }
        }}
      />

      <Button
        disabled={generatingMotif || !prompt.length}
        onClick={handleGenerateClick}
        className="w-full"
        size="sm"
        variant={canClickDone ? "secondary" : "default"}
      >
        {generatingMotif && (
          <LoaderCircle size={15} className="shrink-0 mr-1 animate-spin" />
        )}
        <p className="flex items-center gap-x-1">
          <span>Generate</span>

          <span className="flex items-center gap-x-1">
            <Coins size={15} className="shrink-0 ml-1" />
            <span>{process.env.NEXT_PUBLIC_AI_GENERATE_MOTIF_COST}</span>
          </span>
        </p>
      </Button>

      <Button
        disabled={generatingMotif}
        // onClick={handleDoneClick}
        onClick={handleAddMotifs}
        className="w-full"
        size="sm"
        variant="secondary"
      >
        <Shuffle size={15} className="shrink-0 mr-1" />
        <span>Try an example</span>
      </Button>

      <Button
        disabled={!canClickDone || generatingMotif}
        onClick={handleDoneClick}
        className="w-full"
        size="sm"
      >
        <CircleCheck size={15} className="shrink-0 mr-1" />
        <span>Done</span>
      </Button>
    </div>
  );
};
