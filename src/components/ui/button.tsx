import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "ghost";
  size?: "md" | "sm";
};

export function Button({ variant = "quiet", size = "md", className, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-opacity duration-150",
        "disabled:pointer-events-none disabled:opacity-40",
        size === "md" ? "h-12 min-w-12 px-3 text-sm" : "h-12 min-w-12 px-3 text-sm",
        variant === "primary" && "bg-accent text-accent-fg hover:opacity-90",
        variant === "quiet" && "border border-line bg-surface-2 text-fg hover:bg-surface",
        variant === "ghost" && "text-fg hover:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}
