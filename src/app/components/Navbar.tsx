"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ITEMS = [
  { id: "discount", label: "Discount", src: "/icons/discount.png", href: "/discount", colorClass: "bg-amber-500" },
  { id: "notes", label: "Notes", src: "/icons/notes.png", href: "/notes", colorClass: "bg-indigo-500" },
  { id: "unit", label: "Unit", src: "/icons/unit.png", href: "/converter", colorClass: "bg-yellow-50" },
  { id: "qr", label: "QR", src: "/icons/qr-code.png", href: "/qr", colorClass: "bg-stone-950" },
  { id: "link", label: "Link", src: "/icons/https.png", href: "https://www.virustotal.com/gui/home/url", colorClass: "bg-green-500" },
  { id: "pinterest", label: "Pinterest", src: "/icons/pinterest.png", href: "https://klickpin.com", colorClass: "bg-red-600" },
  { id: "fmhy", label: "Free", src: "/icons/fmhy.png", href: "https://fmhy.net", colorClass: "bg-sky-500" },
  { id: "txt", label: "Cstm Txt", src: "/icons/text.png", href: "https://tools.picsart.com/text/font-generator/", colorClass: "bg-pink-500" },
];


export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  
  const containerCommon =
    "backdrop-blur-xl border border-white/12 shadow-[0_10px_30px_rgba(2,6,23,0.5)] rounded-full";

  /* ------------------ DESKTOP ------------------ */
  const desktop = (
    <nav
      role="navigation"
      aria-label="Primary"
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 flex items-center gap-4 ${containerCommon}
        bg-white/6 dark:bg-white/4`}
      
    >
      {ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full transition-transform duration-200 will-change-transform
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                ${active ? "scale-110 ring-2 ring-white/20 shadow-[0_8px_30px_0_rgba(56,189,248,0.08)]" : "hover:-translate-y-1 hover:scale-105"}
                ${item.colorClass}`}
          >
           
            <Image src={item.src} alt={item.label} width={28} height={28} className="object-contain max-w-[24px] max-h-[24px]" />
            
          </Link>
        );
      })}
    </nav>
  );

  /* ------------------ MOBILE ------------------ */
  const mobile = (
    <nav
      role="navigation"
      aria-label="Primary mobile"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] flex items-center gap-4 px-4 py-3 ${containerCommon}
        bg-white/6 dark:bg-white/4`}
      style={{ maxWidth: "980px" }}
    >
      
      <div className="flex items-center gap-4 w-full overflow-x-auto overflow-y-hidden scrollbar-hide px-1">
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`group relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-150 md:w-16 md:h-16
                ${active ? "scale-105 ring-1 ring-white/20" : "active:scale-95"}
                ${item.colorClass}`}
            >
              <span className="sr-only">{item.label}</span>
              <Image src={item.src} alt={item.label} width={28} height={28} className="object-contain max-w-[24px] max-h-[24px]" />

              <span
                role="tooltip"
                className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-black/70 dark:bg-white/10 text-xs text-white/90 px-2 py-1 opacity-0 scale-95 transform transition-all duration-150 group-hover:opacity-100"
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );

  return isMobile ? mobile : desktop;
}
