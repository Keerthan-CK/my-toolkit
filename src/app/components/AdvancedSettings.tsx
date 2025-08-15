"use client";

import { useState, useEffect } from "react";

interface QRSettings {
  dotsOptions: { type: "square" | "rounded" | "dots" | "extra-rounded" };
  cornersSquareOptions: { type: "square" | "dot" | "extra-rounded" };
  cornersDotOptions: { type: "square" | "dot" };
  imageOptions: { imageSize: number };
}

interface AdvancedSettingsProps {
  onSettingsChange: (settings: QRSettings) => void;
}

export default function AdvancedSettings({ onSettingsChange }: AdvancedSettingsProps) {
  const [dotsType, setDotsType] = useState<QRSettings["dotsOptions"]["type"]>("rounded");
  const [cornerSquareType, setCornerSquareType] = useState<QRSettings["cornersSquareOptions"]["type"]>("square");
  const [cornerDotType, setCornerDotType] = useState<QRSettings["cornersDotOptions"]["type"]>("dot");
  const [logoSize, setLogoSize] = useState(0.2);

  useEffect(() => {
    onSettingsChange({
      dotsOptions: { type: dotsType },
      cornersSquareOptions: { type: cornerSquareType },
      cornersDotOptions: { type: cornerDotType },
      imageOptions: { imageSize: logoSize },
    });
  }, [dotsType, cornerSquareType, cornerDotType, logoSize, onSettingsChange]);

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/20 flex flex-col gap-4">
      <h3 className="text-sm font-medium text-white/80">Advanced Styling</h3>

      {/* Dots Shape */}
      <div>
        <label className="block text-xs text-white/70 mb-1">Dots Shape</label>
        <select
          value={dotsType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setDotsType(e.target.value as QRSettings["dotsOptions"]["type"])
          }
          className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-2 py-1"
        >
          <option value="square" className="text-gray-900">Square</option>
          <option value="rounded" className="text-gray-900">Rounded</option>
          <option value="dots" className="text-gray-900">Dots</option>
          <option value="extra-rounded" className="text-gray-900">Extra Rounded</option>
        </select>
      </div>

      {/* Corner Square Shape */}
      <div>
        <label className="block text-xs text-white/70 mb-1">Corner Square Shape</label>
        <select
          value={cornerSquareType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCornerSquareType(e.target.value as QRSettings["cornersSquareOptions"]["type"])
          }
          className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-2 py-1"
        >
          <option value="square" className="text-gray-900">Square</option>
          <option value="dot" className="text-gray-900">Dot</option>
          <option value="extra-rounded" className="text-gray-900">Extra Rounded</option>
        </select>
      </div>

      {/* Corner Dot Shape */}
      <div>
        <label className="block text-xs text-white/70 mb-1">Corner Dot Shape</label>
        <select
          value={cornerDotType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCornerDotType(e.target.value as QRSettings["cornersDotOptions"]["type"])
          }
          className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-2 py-1"
        >
          <option value="square" className="text-gray-900">Square</option>
          <option value="dot" className="text-gray-900">Dot</option>
        </select>
      </div>

      {/* Logo Size */}
      <div>
        <label className="block text-xs text-white/70 mb-1">
          Logo Size (% of QR)
        </label>
        <input
          type="range"
          min="0.1"
          max="0.3"
          step="0.01"
          value={logoSize}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLogoSize(parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
