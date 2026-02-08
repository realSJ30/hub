"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.ComponentProps<"input"> {
  label?: string;
  valueDisplay?: string;
}

function Slider({ className, label, valueDisplay, ...props }: SliderProps) {
  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center px-0.5">
        {label && (
          <span className="text-xs font-medium text-neutral-600 font-mono uppercase tracking-wider">
            {label}
          </span>
        )}
        {valueDisplay && (
          <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded leading-none">
            {valueDisplay}
          </span>
        )}
      </div>
      <input
        type="range"
        className={cn(
          "w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900 border-none outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 transition-all",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Slider };
