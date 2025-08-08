"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  index: number;
  label: string;
  src: string;
  href?: string;
  colorClass?: string;
  pos: { x: number; y: number };
  isOpen: boolean;
  size: number;
  isFocused: boolean;
  setFocus: () => void;
};

const variants: Variants = {
  closed: { x: 0, y: 0, opacity: 0, scale: 0.6 },
  open: (custom: { x: number; y: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 360, damping: 28 },
  }),
  exit: { x: 0, y: 0, opacity: 0, scale: 0.6, transition: { duration: 0.18 } },
};

export default function RadialItem(props: Props) {
  const {
    label,
    src,
    href,
    colorClass = "bg-white",
    pos,
    isOpen,
    size,
    isFocused,
    setFocus,
  } = props;

  const router = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);


  useEffect(() => {
    if (isFocused && ref.current) ref.current.focus();
  }, [isFocused]);

  function activate() {
    if (!isOpen || !href) return;
    
    if (/^https?:\/\//.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  }

  const imgSize = Math.round(size * 0.6);

  return (
    <motion.button
      className={`pointer-events-auto absolute cursor-pointer rounded-full shadow-lg overflow-hidden flex items-center justify-center ${colorClass}`}
      style={{
        width: size,
        height: size,
        left: `-${size / 2}px`,
        top: `-${size / 2}px`,
      }}
      custom={pos}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      exit="exit"
      variants={variants}
      onClick={activate}
      onFocus={setFocus}
      ref={ref}
      aria-label={label}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={src}
          alt={label}
          width={imgSize}
          height={imgSize}
          draggable={false}
          style={{ objectFit: "contain", pointerEvents: "none" }}
        />
      </div>
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}
