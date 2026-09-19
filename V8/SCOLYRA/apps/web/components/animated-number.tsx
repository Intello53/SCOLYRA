"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";

/**
 * AnimatedNumber — compte de 0 (ou d'une valeur de départ) jusqu'à la
 * valeur cible dès que le composant entre dans le viewport. Donne au
 * dashboard sa sensation "vivante" plutôt qu'un simple texte statique.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  duration = 1,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const motionValue = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      motionValue.set(value);
      if (ref.current) ref.current.textContent = value.toFixed(decimals) + suffix;
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        if (ref.current) ref.current.textContent = latest.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, suffix, duration, motionValue, reduce]);

  return <span ref={ref}>0{suffix}</span>;
}
