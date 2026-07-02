'use client';

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../lib/cn";

// MIPUL-285: optionaler `tone` für Range/Thumb-Farbe — z. B. "success" für
// abgeschlossene Missions (grüner Balken).
type SliderTone = 'primary' | 'success'

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  tone?: SliderTone
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, tone = 'primary', ...props }, ref) => {
  // PUL-462 Schritt 11: neutrales `success`-Token statt Pulse-`sprout`
  // (identischer Farbwert; das DS-Package bleibt domain-frei).
  const rangeColor = tone === 'success' ? 'bg-success' : 'bg-primary'
  const thumbBorder = tone === 'success' ? 'border-success' : 'border-primary'
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer">
        <SliderPrimitive.Range className={cn("absolute h-full transition-colors", rangeColor)} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn("block size-5 rounded-full border-2 bg-background ring-offset-background transition-colors cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", thumbBorder)} />
    </SliderPrimitive.Root>
  )
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
