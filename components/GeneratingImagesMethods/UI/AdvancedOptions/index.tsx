/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/*
 * Global UI Components
 * */
import { Prompt } from "@/components/GlobalUI/Prompt";

/*
 * Icons
 * */
import { ChevronDownIcon } from "lucide-react";

export const AdvancedOptions = () => {
  const { negativePrompt, setNegativePrompt } = useDashboardStore();

  const tooltipContent = `
        - Exclude unwanted elements: 'stripes', 'polka dots', etc. <br />
        - Enforce a specific style: 'cartoon style', 'abstract style', etc. <br />
        - Prevent unwanted combinations: 'floral designs with stripes', etc.`;

  return (
    <Collapsible className="w-full py-4">
      <CollapsibleTrigger className="w-full">
        <div className="w-full flex items-center justify-between border py-2 px-3 rounded-xl">
          <h3>Advanced options</h3>
          <ChevronDownIcon />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="py-3 px-3">
        <Prompt
          title="Negative prompt"
          id="negativePrompt"
          showGuidToGeneratePrompt={false}
          tooltipContent={tooltipContent}
          showTryAnExample={false}
          value={negativePrompt || ""}
          setValue={setNegativePrompt}
          placeholder="Keywords to avoid, for example 'deformed', 'ugly', 'asymmetrical'..."
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
