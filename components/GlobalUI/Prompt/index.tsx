/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Global UI components
 * */
import { GlobalTooltipContent } from "@/components/GlobalUI/TooltipContent";

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

interface IPrompt {
  title: string;
  id: string;
  showGuidToGeneratePrompt: boolean;
  tooltipContent: string;
  showTryAnExample: boolean;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}

export const Prompt = ({
  showGuidToGeneratePrompt,
  showTryAnExample,
  tooltipContent,
  title,
  id,
  value,
  setValue,
  placeholder,
}: IPrompt) => {
  const { setPrompt } = useDashboardStore();

  // Only for the prompt
  const handleTryAnExamplePrompt = () => {
    const randomPatternNumber = Math.floor(
      Math.random() * randomPrompts.length,
    );
    setPrompt(randomPrompts[randomPatternNumber]);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div>
      {/*Label & information on how to generate a pattern!*/}
      <div className="flex items-center justify-between w-full">
        <Label className="font-medium text-md" htmlFor={id}>
          {title}
        </Label>
        <div className="flex items-start gap-x-2">
          {showGuidToGeneratePrompt && (
            <Link
              href="https://www.patterned.ai/prompt-guide"
              target="_blank"
              className="text-gray-500 hover:underline"
            >
              How to generate a prompt?
            </Link>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp size={22} />
              </TooltipTrigger>

              <TooltipContent className="max-w-md">
                <GlobalTooltipContent content={tooltipContent} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {/*Textarea*/}
      <div className="mt-2">
        <div className="relative">
          <Textarea
            placeholder={placeholder}
            id={id}
            name={id}
            className="resize-none rounded-xl"
            rows={5}
            defaultValue={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            required
          ></Textarea>
          {showTryAnExample && (
            <Button
              className="absolute bottom-2 right-4 z-10 rounded-full drop-shadow-sm hover:bg-secondary"
              variant="secondary"
              onClick={handleTryAnExamplePrompt}
            >
              Try an example
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
