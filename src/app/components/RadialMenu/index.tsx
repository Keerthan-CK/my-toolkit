"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useRadial from "./useRadial";
import RadialItem from "./RadialItem";
import "./radial.css";

const ITEMS = [
  { id: "discount", label: "Discount", src: "/icons/discount.png", href: "/discount", colorClass: "bg-amber-500" },
  { id: "notes", label: "Notes", src: "/icons/notes.png", href: "/notes", colorClass: "bg-indigo-500" },
  { id: "unit", label: "Unit", src: "/icons/unit.png", href: "/converter", colorClass: "bg-yellow-50" },
  { id: "qr", label: "QR", src: "/icons/qr-code.png", href: "/qr", colorClass: "bg-stone-950" },
  { id: "link", label: "Link", src: "/icons/https.png", href: "https://www.virustotal.com/gui/home/url", colorClass: "bg-green-500" },
  { id: "pinterest", label: "Pinterest", src: "/icons/pinterest.png", href: "https://klickpin.com", colorClass: "bg-rose-300" },
  { id: "fmhy", label: "Free", src: "/icons/fmhy.png", href: "https://fmhy.net", colorClass: "bg-sky-500" },
  { id: "txt", label: "Cstm Txt", src: "/icons/text.png", href: "https://tools.picsart.com/text/font-generator/", colorClass: "bg-pink-500" },
];


export default function RadialMenu() {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Keyboard shortcut listener
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
      <motion.button
        aria-label="Toggle radial menu"
        type="button"
        className="radial-center relative rounded-full overflow-hidden cursor-pointer"
        style={{ width: centerSize, height: centerSize }}
        initial={{ scale: 1 }}
        animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.img
          src="/icons/middle.gif"
          alt="center animation"
          className="w-full h-full rounded-full object-cover block"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      <motion.div
        className="radial-items"
        initial={false}
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
