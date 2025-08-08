"use client";

import React from "react";
import RadialMenu from "./components/RadialMenu";
import { useEffect } from "react";
import AppLayout from "./components/AppLayout";

export default function HomePage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AppLayout>
    <main className="h-screen overflow-hidden">
      <RadialMenu />
    </main>
    </AppLayout>
  );
}
