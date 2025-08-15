"use client";

import { ReactNode } from "react";

interface ResponsiveLayoutProps {
  left: ReactNode;   
  right: ReactNode;  
}

export default function ResponsiveLayout({ left, right }: ResponsiveLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4">
      
      {/* Left Section */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        {left}
      </div>

      {/* Right Section */}
      <div className="lg:w-2/3 flex justify-center items-center">
        {right}
      </div>
    </div>
  );
}
