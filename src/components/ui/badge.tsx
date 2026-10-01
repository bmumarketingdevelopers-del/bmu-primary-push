import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./badge.module.css";

const badgeVariants = cva(styles.badge, {
  variants: {
    variant: {
      default: styles.default,
      solid: styles.solid,
      secondary: styles.secondary,
      outline: styles.outline,
      success: styles.success,
      warning: styles.warning,
      destructive: styles.destructive,
      info: styles.info,
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Renders a span, not a div.
 *
 * A badge almost always sits inside running text — next to a name in a
 * heading, beside a row label, inside a paragraph. HTML forbids a div inside
 * a p, and React repairs that mismatch during hydration, which produces a
 * hydration error and a flash of wrong markup.
 *
 * A span is valid in every one of those positions and styles identically
 * here, since the variants already set `inline-flex`.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
