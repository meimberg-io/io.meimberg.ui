'use client';

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../lib/cn";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

// PUL-429: PopoverAnchor exportieren, damit Konsumenten die Popover-Position
// an ein bestehendes Element verankern können, ohne den Trigger zu sein.
// Genutzt z. B. von `OptionsDropdown`, dessen Trigger der `FilterPillButton`-
// Atom ist (eigenes onClick zum Toggeln) — der Anchor liefert die Position
// für den portalisierten Content.
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 max-w-[calc(100vw-2rem)] rounded-md border bg-popover p-4 text-popover-foreground shadow-floating outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
