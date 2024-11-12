/*
 * NextJS & ReactJS components
 * */
import React from "react";
import Link from "next/link";

/*
 * UI Components
 * */
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * Constants
 * */
import { randomPrompts } from "@/constants";

/*
 * Icons
 * */
import { CircleHelp } from "lucide-react";

export const Prompt = () => {
  const { prompt, setPrompt } = useDashboardStore();

  const handleTryAnExamplePrompt = () => {
    const randomPatternNumber = Math.floor(
      Math.random() * randomPrompts.length,
    );
    setPrompt(randomPrompts[randomPatternNumber]);
  };

  return (
    <div>
      {/*Label & information on how to generate pattern!*/}
      <div className="flex items-center justify-between w-full">
        <Label className="font-medium text-md" htmlFor="prompt">
          Prompt
        </Label>
        <div className="flex items-start gap-x-2">
          <Link
            href="https://www.patterned.ai/prompt-guide"
            target="_blank"
            className="text-gray-500 hover:underline"
          >
            How to generate a prompt?
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp size={22} />
              </TooltipTrigger>

              <TooltipContent className="max-w-md">
                - Be as descriptive as possible, use style names, artists names,
                colour scheme, vibe, .. etc <br />- Words at the beginning of
                the prompt have higher affect on the final image
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {/*Textarea*/}
      <div className="mt-2">
        <div className="relative">
          <Textarea
            placeholder="Describe your pattern elements, colours and background..."
            id="prompt"
            name="prompt"
            className="resize-none rounded-xl"
            rows={5}
            defaultValue={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            required
          ></Textarea>
          <Button
            className="absolute bottom-2 right-4 z-10 rounded-full drop-shadow-sm hover:bg-secondary"
            variant="secondary"
            onClick={handleTryAnExamplePrompt}
          >
            Try an example
          </Button>
        </div>
      </div>
    </div>
  );
};
