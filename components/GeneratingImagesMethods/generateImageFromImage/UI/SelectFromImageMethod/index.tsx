/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export const SelectFromImageMethod = () => {
  const { generationMethod, setGenerationMethod } = useDashboardStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select
      onValueChange={(value: "Variation" | "Image mixing") => {
        setGenerationMethod(value);
      }}
      defaultValue={generationMethod}
    >
      <SelectTrigger className="w-full py-5">
        <SelectValue placeholder={generationMethod} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Variation" className="py-3 cursor-pointer">
          Variation
        </SelectItem>
        <SelectItem value="Image mixing" className="py-3 cursor-pointer">
          Image mixing
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
