"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Render as a different element (default div). */
  as?: "div" | "li" | "article" | "section";
}

/** Fade + rise into view once, on scroll. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease: EXPO_OUT }}
    >
      {children}
    </Tag>
  );
}
