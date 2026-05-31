import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-[13px] font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-brand-navy text-white hover:bg-brand-navy/90": variant === "primary",
            "bg-brand-copper text-white hover:bg-brand-copper/90": variant === "secondary",
            "border border-brand-navy bg-transparent text-brand-navy hover:bg-brand-navy hover:text-white": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "text-brand-navy underline-offset-4 hover:underline": variant === "link",
            "h-8 px-4": size === "sm",
            "h-10 px-5 py-2": size === "md",
            "h-12 px-6 text-[14px]": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
