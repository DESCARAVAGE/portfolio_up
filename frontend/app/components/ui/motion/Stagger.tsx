"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE_OUT, stagger } from "@/app/lib/motion";

const CONTAINERS = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl };
const ITEMS = { div: motion.div, li: motion.li };

const ITEM_VARIANTS: Record<"up" | "right", Variants> = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } },
  right: { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } } },
};

/** Liste dont les éléments (<StaggerItem>) apparaissent en cascade à l'arrivée à l'écran. */
export function Stagger({
  as = "div",
  step = 0.1,
  amount = 0.25,
  className,
  children,
}: {
  as?: keyof typeof CONTAINERS;
  step?: number;
  amount?: number;
  className?: string;
  children: ReactNode;
}) {
  const Tag = CONTAINERS[as];
  return (
    <Tag
      variants={stagger(step)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  as = "div",
  effect = "up",
  className,
  children,
}: {
  as?: keyof typeof ITEMS;
  effect?: keyof typeof ITEM_VARIANTS;
  className?: string;
  children: ReactNode;
}) {
  const Tag = ITEMS[as];
  return (
    <Tag variants={ITEM_VARIANTS[effect]} className={className}>
      {children}
    </Tag>
  );
}
