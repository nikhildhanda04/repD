import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_2px_0_0_rgba(255,255,255,0.12),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_4px_8px_-2px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_8px_16px_-4px_rgba(0,0,0,0.35),0_4px_6px_-2px_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-[inset_0_3px_6px_0_rgba(0,0,0,0.4),0_1px_2px_0_rgba(0,0,0,0.15)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.7),inset_0_-2px_4px_0_rgba(0,0,0,0.04),0_4px_8px_-2px_rgba(0,0,0,0.08),0_2px_4px_-1px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.7),inset_0_-2px_4px_0_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.12),0_4px_6px_-2px_rgba(0,0,0,0.06)] active:translate-y-0.5 active:shadow-[inset_0_3px_6px_0_rgba(0,0,0,0.08),0_1px_2px_0_rgba(0,0,0,0.04)] dark:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.06),inset_0_-2px_4px_0_rgba(0,0,0,0.3),0_4px_8px_-2px_rgba(0,0,0,0.4)] dark:hover:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.08),inset_0_-2px_4px_0_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(0,0,0,0.5)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary shadow-[inset_0_2px_0_0_rgba(255,255,255,0.5),inset_0_-2px_4px_0_rgba(0,0,0,0.04),0_4px_8px_-2px_rgba(0,0,0,0.06),0_2px_4px_-1px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.5),inset_0_-2px_4px_0_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-[inset_0_3px_6px_0_rgba(0,0,0,0.08)]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.3),inset_0_-2px_4px_0_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.3),inset_0_-2px_4px_0_rgba(0,0,0,0.06),0_8px_16px_-4px_rgba(0,0,0,0.12)] active:translate-y-0.5 active:shadow-[inset_0_3px_6px_0_rgba(0,0,0,0.12)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-xl px-2.5 text-xs in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-xl px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs":
          "size-7 rounded-xl in-data-[slot=button-group]:rounded-xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-xl in-data-[slot=button-group]:rounded-xl",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
