import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  return (
    <div
      className={cn("animate-pulse bg-surface", variants[variant], className)}
      {...props}
    />
  );
}
