"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Space background videos */}
      <video
        className="bg-video fixed inset-0 object-cover w-full h-full z-[-2]"
        src="/videos/galaxy.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <video
        className="nav-edge-video fixed top-0 left-0 w-full h-[20vh] object-cover z-[-1] opacity-30"
        src="/videos/blackhole.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Layout wrapper */}
      <div className="flex flex-col min-h-screen text-white bg-black bg-opacity-80">
        <header className="h-16" />

        {/* Lottie animation */}
        <div className="flex justify-center mt-16 z-10 md:hidden">
          <DotLottieReact
            src="https://lottie.host/5d33e61a-0d58-4adc-8e24-0854a61ca292/N5WI25ZILI.lottie"
            loop
            autoplay
            className="top-1 w-60 h-60 sm:w-60 sm:h-60"
          />
        </div>


        <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full z-10">
          {children}
        </main>
      </div>
    </>
  );
}
