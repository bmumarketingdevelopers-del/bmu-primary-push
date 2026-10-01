"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./accordion.module.css";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(styles.item, className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

/**
 * `icon="plus"` (default) turns into a filled ×; `icon="chevron"` is a round outlined arrow that points
 * down when closed and flips up when open.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { icon?: "plus" | "chevron" }
>(({ className, children, icon = "plus", ...props }, ref) => (
  <AccordionPrimitive.Header className={styles.header}>
    <AccordionPrimitive.Trigger ref={ref} className={cn(styles.trigger, className)} {...props}>
      {children}
      {icon === "chevron" ? (
        <span className={styles.chevronIcon}>
          <ChevronDown className={styles.chevron} strokeWidth={2.25} />
        </span>
      ) : (
        <span className={styles.icon}>
          <Plus className={styles.plus} />
        </span>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className={styles.content} {...props}>
    <div className={cn(styles.body, className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };