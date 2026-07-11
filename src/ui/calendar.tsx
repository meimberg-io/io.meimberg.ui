'use client';

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../lib/cn";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      // `relative` macht den rdp-root zum Positionierungs-Kontext für die
      // `absolute` Nav-Chevrons (button_previous/next). react-day-picker v9
      // rendert die Nav als Sibling des Month, nicht mehr in der `relative`
      // Caption — ohne das hängen sich die Buttons an den nächsten
      // positionierten Vorfahren (Popover) und überlappen den Content.
      className={cn("relative p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "body font-medium",
        nav: "flex items-center gap-1",
        // `top-3` (nicht `top-0`) kompensiert das `p-3` des rdp-root: die
        // absolut positionierten Chevrons sitzen sonst am Padding-Rand und
        // wirken gegenüber dem Monats-Label (das im gepaddeten Content liegt)
        // nach oben verrutscht. Mit `top-3` liegen sie auf einer Linie.
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 top-3",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 top-3",
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center body focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("size-4", chevronClassName)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
