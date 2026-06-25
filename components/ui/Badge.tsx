import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export default function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface text-ivory border-border",
    success: "bg-green-900/30 text-green-400 border-green-800",
    warning: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    danger: "bg-red-900/30 text-red-400 border-red-800",
    info: "bg-blue-900/30 text-blue-400 border-blue-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
