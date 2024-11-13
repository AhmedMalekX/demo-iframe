/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Store
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI components
 * */
import { AdvancedOptions } from "@/components/GeneratingImagesMethods/UI/AdvancedOptions";
import { Button } from "@/components/ui/button";

/*
 * Global UI Components
 * */
import { Styles } from "@/components/GlobalUI/Styles";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";
import { Prompt } from "@/components/GlobalUI/Prompt";
import { RequiredCredits } from "@/components/GlobalUI/RequiredCredits";

export const GenerateImageFromText = () => {
  const { prompt, setPrompt } = useDashboardStore();

  const tooltipContent = `
        - Be as descriptive as possible, use style names, artists names, colour scheme, vibe, .. etc <br />
        - Words at the beginning of the prompt have higher effect on the final image
  `;

  return (
    <div>
      {/*Prompt*/}
      <Prompt
        value={prompt || ""}
        id="prompt"
        setValue={setPrompt}
        showTryAnExample={true}
        tooltipContent={tooltipContent}
        showGuidToGeneratePrompt={true}
        title="Prompt"
        placeholder="Describe your pattern elements, colours and background..."
      />

      <hr className="mt-6" />

      {/*Styles*/}
      <Styles />

      {/*Number of images*/}
      <NumberOfImages />

      <hr className="mt-6" />

      {/*Advanced options*/}
      <AdvancedOptions />

      {/*Required credits*/}
      <RequiredCredits />

      {/*Generate button*/}
      <Button variant="primary" size="primary" className="my-4 w-full">
        Generate pattern
      </Button>
    </div>
  );
};
