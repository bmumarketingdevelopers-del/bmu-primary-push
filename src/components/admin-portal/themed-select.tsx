"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./themed-select.module.css";

export type ThemedOption<T extends string> = {
  value: T;
  label: string;
  /** Optional class for a coloured dot before the label (status colours) */
  dotClassName?: string;
};

/**
 * Dropdown styled with the site theme (light and dark), replacing the browser's native
 * <select> list, which can't be styled. Keyboard: arrows to move, Enter to pick, Esc to close.
 */
export function ThemedSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  triggerClassName,
  align = "start",
  icon,
}: {
  value: T;
  options: ThemedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  triggerClassName?: string;
  align?: "start" | "end";
  icon?: React.ReactNode;
}) {
  const current = options.find((o) => o.value === value);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`${ariaLabel}: ${current?.label ?? value}`}
          className={cn(styles.trigger, triggerClassName)}
          // Inside clickable table rows and cards: don't also open the lead
          onClick={(e) => e.stopPropagation()}
        >
          {icon}
          <span className={styles.label}>{current?.label ?? value}</span>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={6}
          collisionPadding={12}
          className={styles.menu}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.RadioGroup value={value} onValueChange={(v) => onChange(v as T)}>
            {options.map((o) => (
              <DropdownMenu.RadioItem key={o.value} value={o.value} className={styles.item}>
                <span className={styles.itemLabel}>
                  {o.dotClassName && <span className={cn(styles.dot, o.dotClassName)} aria-hidden="true" />}
                  {o.label}
                </span>
                <DropdownMenu.ItemIndicator className={styles.check}>
                  <Check />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
