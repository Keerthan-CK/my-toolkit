"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import isEqual from "lodash.isequal";


interface QRSettings {
  dotsOptions: { type: "square" | "rounded" | "dots" | "extra-rounded" };
  cornersSquareOptions: { type: "square" | "dot" | "extra-rounded" };
  cornersDotOptions: { type: "square" | "dot" };
  imageOptions: { imageSize: number; hideBackgroundDots: boolean; margin: number };
}

interface AdvancedSettingsProps {
  onSettingsChange: (settings: QRSettings) => void;
}

const initialSettings: QRSettings = {
  dotsOptions: { type: "rounded" },
  cornersSquareOptions: { type: "square" },
  cornersDotOptions: { type: "dot" },
  imageOptions: { imageSize: 0.2, hideBackgroundDots: true, margin: 8 }
};

export default function AdvancedSettings({ onSettingsChange }: AdvancedSettingsProps) {
  const [settings, setSettings] = useState<QRSettings>(initialSettings);
  const prevSettingsRef = useRef<QRSettings>(initialSettings);

  // Only call onSettingsChange when settings actually change
  useEffect(() => {
    if (!isEqual(settings, prevSettingsRef.current)) {
      onSettingsChange(settings);
      prevSettingsRef.current = settings;
    }
  }, [settings, onSettingsChange]);

  const handleDotsTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSettings(prev => ({
        ...prev,
        dotsOptions: { type: e.target.value as QRSettings["dotsOptions"]["type"] }
      }));
    },
    []
  );

  const handleCornerSquareTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSettings(prev => ({
        ...prev,
        cornersSquareOptions: { type: e.target.value as QRSettings["cornersSquareOptions"]["type"] }
      }));
    },
    []
  );

  const handleCornerDotTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSettings(prev => ({
        ...prev,
        cornersDotOptions: { type: e.target.value as QRSettings["cornersDotOptions"]["type"] }
      }));
    },
    []
  );

  const handleLogoSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings(prev => ({
        ...prev,
        imageOptions: { 
          ...prev.imageOptions,
          imageSize: parseFloat(e.target.value) 
        }
      }));
    },
    []
  );

  const handleClearSpaceToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings(prev => ({
        ...prev,
        imageOptions: { 
          ...prev.imageOptions,
          hideBackgroundDots: e.target.checked 
        }
      }));
    },
    []
  );

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/20 flex flex-col gap-4">
      <h3 className="text-sm font-medium text-white/80">Advanced Styling</h3>

      {/* Dots Shape */}
      <div>
        <label className="block text-xs text-white/70 mb-1">Dots Shape</label>
        <select
          value={settings.dotsOptions.type}
          onChange={handleDotsTypeChange}
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
          value={settings.cornersSquareOptions.type}
          onChange={handleCornerSquareTypeChange}
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
          value={settings.cornersDotOptions.type}
          onChange={handleCornerDotTypeChange}
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
          value={settings.imageOptions.imageSize}
          onChange={handleLogoSizeChange}
          className="w-full"
        />
      </div>

      {/* Clear space behind logo */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.imageOptions.hideBackgroundDots}
          onChange={handleClearSpaceToggle}
          className="accent-fuchsia-500"
        />
        <label className="text-xs text-white/70">Clear space behind logo</label>
      </div>
    </div>
  );
}
