/*
 * Utils
 * */
import { cn } from "@/lib/utils";

interface ITooltipContent {
  className?: string;
  content: string;
}

export const GlobalTooltipContent = ({
  className,
  content,
}: ITooltipContent) => (
  <div
    className={cn(className)}
    dangerouslySetInnerHTML={{ __html: content }}
  />
);
