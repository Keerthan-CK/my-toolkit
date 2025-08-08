"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import useRadial from "./useRadial";
import RadialItem from "./RadialItem";
import "./radial.css";

// Clean string-based icon paths
const ITEMS = [
  { id: "twitter", label: "Twitter", src: "/icons/twitter.png", href: "https://twitter.com", colorClass: "bg-sky-500" },
  { id: "discount", label: "Discount", src: "/icons/discount.png", href: "/discount", colorClass: "bg-amber-500" },
  { id: "notes", label: "Notes", src: "/icons/notes.png", href: "/notes", colorClass: "bg-indigo-500" },
  { id: "ocr", label: "OCR", src: "/icons/ocr.png", href: "/ocr", colorClass: "bg-pink-500" },
  { id: "qr", label: "QR", src: "/icons/qr-code.png", href: "/qr", colorClass: "bg-stone-300" },
  { id: "pinterest", label: "Pinterest", src: "/icons/pinterest.png", href: "https://pinterest.com", colorClass: "bg-rose-700" },
  { id: "task", label: "Tasks", src: "/icons/task.png", href: "/tasks", colorClass: "bg-green-500" },
  { id: "unit", label: "Unit", src: "/icons/unit.png", href: "/converter", colorClass: "bg-yellow-50" },
];


const containerVariants: Variants = {
  closed: {},
  open: {},
};

export default function RadialMenu() {
  // RadialMenu.tsx
const isSmallScreen = typeof window !== "undefined" && window.innerWidth <= 640;

const {
  isOpen,
  setIsOpen,
  positions,
  size,
  centerSize,
  focusedIndex,
  setFocusedIndex,
  toggle,
} = useRadial(ITEMS.length, {
  radius: isSmallScreen ? 135 : 180,
  size: isSmallScreen ? 80 : 116,
  centerSize: isSmallScreen ? 135 : 190,
});

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || e.key === "/") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <div className="radial-root" aria-hidden={false}>
{/* Center gif */}
<motion.div
  className="radial-center relative rounded-full overflow-hidden cursor-pointer"
  style={{ width: centerSize, height: centerSize, pointerEvents: "auto" }}
  initial={{ scale: 1 }}
  animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
  transition={{ duration: 0.5 }}
  onClick={() => setIsOpen(!isOpen)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <motion.img
    src="/icons/middle.gif"
    alt="center animation"
    className="w-full h-full rounded-full cursor-pointer"
    style={{
      objectFit: "cover",
      display: "block",
    }}
    initial={{ scale: 1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
    transition={{ duration: 0.5 }}
    onClick={() => setIsOpen(!isOpen)}
  />
</motion.div>


      {/* Animated menu items */}
      <motion.div
        className="radial-items"
        variants={containerVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <AnimatePresence>
          {ITEMS.map((it, i) => (
            <RadialItem
              key={it.id}
              index={i}
              id={it.id}
              label={it.label}
              src={it.src}
              href={it.href}
              colorClass={it.colorClass}
              pos={positions[i]}
              isOpen={isOpen}
              size={size}
              isFocused={focusedIndex === i}
              setFocus={() => setFocusedIndex(i)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
