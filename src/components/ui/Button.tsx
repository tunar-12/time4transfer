"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap antialiased",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-charcoal hover:bg-gold-soft hover:shadow-[0_0_0_4px_rgba(202,138,4,0.18)] active:scale-[0.98]",
        secondary:
          "bg-charcoal text-bone hover:bg-stone active:scale-[0.98]",
        outline:
          "border border-charcoal/15 bg-transparent text-charcoal hover:bg-charcoal/5 hover:border-charcoal/30",
        outlineLight:
          "border border-white/15 bg-white/[0.04] text-bone backdrop-blur hover:bg-white/[0.08] hover:border-white/30",
        ghost:
          "bg-transparent text-current hover:bg-current/5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
