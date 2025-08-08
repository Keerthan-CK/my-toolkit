"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type UseRadialOptions = {
  radius?: number;
  size?: number;
  centerSize?: number;
};

export default function useRadial(count: number, opts?: UseRadialOptions) {
  const radius = opts?.radius ?? 180;
  const size = opts?.size ?? 72;
  const centerSize = opts?.centerSize ?? 128;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 640);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // compute positions in a circle starting at top (-90deg)
  const positions = useMemo(() => {
    const arr = new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return { x: Math.round(Math.cos(angle) * radius), y: Math.round(Math.sin(angle) * radius) };
    });
    return arr;
  }, [count, radius]);

  const toggle = useCallback(() => {
    setIsOpen((s) => {
      const next = !s;
      if (!next) setFocusedIndex(null);
      else setFocusedIndex(0);
      return next;
    });
  }, []);

  // keyboard navigation handling
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
        setFocusedIndex(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setFocusedIndex((i) => (i === null ? 0 : (i + 1) % count));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setFocusedIndex((i) => (i === null ? count - 1 : (i - 1 + count) % count));
      } else if (e.key === "Tab") {
        // allow normal tabbing but close on shift+tab from first?
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, count]);

  return {
    isOpen,
    setIsOpen,
    positions,
    radius,
    size,
    centerSize,
    focusedIndex,
    setFocusedIndex,
    isMobile,
    toggle,
  };
}
