'use client';

import { cn } from "../lib/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} {...props} />;
}

export { Skeleton };
