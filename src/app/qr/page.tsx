"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Options } from "qr-code-styling";

import ResponsiveLayout from "@/app/components/ResponsiveLayout";
import QrControls from "@/app/components/QrControls";
import QrPreview from "@/app/components/QrPreview";
import LogoUploader from "@/app/components/LogoUploader";
import AdvancedSettings from "@/app/components/AdvancedSettings";

import { embedImageInQr } from "@/app/utils/embedImageInQr";

export default function QrGeneratorPage() {
  
  const [qrData, setQrData] = useState<string>("https://example.com");

 
  const [baseOptions, setBaseOptions] = useState<Partial<Options>>({
  dotsOptions: { color: "#000", type: "rounded" },
  backgroundOptions: { color: "transparent" },
});

  
  const [advancedOptions, setAdvancedOptions] = useState<Partial<Options>>({});

 
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);

 
  const [size, setSize] = useState<number>(300);

 
  function handleControlsChange(data: string, options: Partial<Options>) {
    setQrData(data ?? "");
    setBaseOptions(options ?? {});
  }

  
  function handleAdvancedSettings(settings: Partial<Options>) {
    setAdvancedOptions((prev) => ({ ...prev, ...(settings || {}) }));
  }

  
  const mergedOptions = useMemo(() => {
    const combined: Partial<Options> = {
      width: size,
      height: size,
      
      ...baseOptions,
      ...advancedOptions,
      
      imageOptions: {
        ...(baseOptions?.imageOptions as Record<string, unknown> || {}),
        ...(advancedOptions?.imageOptions as Record<string, unknown> || {}),
      },
    };

    
    const final = embedImageInQr(combined as Partial<Options>, logoDataUrl);
    return final;
  }, [baseOptions, advancedOptions, logoDataUrl, size]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Page header */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-300 mb-4"
        >
          QR Code Generator
        </motion.h1>

        <p className="text-center text-sm text-white/70 mb-6 max-w-2xl mx-auto">
          Create beautiful, branded QR codes — supports URL, text, Wi-Fi, vCard, email, SMS & UPI.
          Upload a logo, tweak styles, and download as PNG / SVG / JPEG.
        </p>
      </div>

      {/* Main content */}
      <ResponsiveLayout
        left={
          <div className="space-y-6">
            <div>
              {/* Controls panel */}
              <QrControls onChange={handleControlsChange} />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Logo uploader */}
              <LogoUploader onLogoChange={(d) => setLogoDataUrl(d)} />

              {/* Advanced settings */}
              <AdvancedSettings onSettingsChange={handleAdvancedSettings} />

              {/* Size slider + quick download hint */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/20">
                <label className="block text-sm text-white/80 mb-2">Preview size</label>
                <input
                  type="range"
                  min={120}
                  max={800}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 text-xs text-white/70">Size: {size}px — larger sizes are better for printing.</div>
              </div>
            </div>

            {/* Footer / metadata */}
            <div className="text-xs text-white/60">
              <div>Tip: use error correction H if you embed a large logo.</div>
              <div className="mt-2">
                <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="text-white/80 hover:underline">
                  Check out my GitHub
                </a>
              </div>
            </div>
          </div>
        }
        right={
          <div className="w-full flex flex-col items-center gap-6">
            {/* Preview panel */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/20 w-full max-w-sm">
              <QrPreview data={qrData} options={mergedOptions} />
            </div>

            {/* External download / share controls (note: QrPreview already has built-in download buttons) */}
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition text-sm"
                onClick={() => {
                  if (!qrData) return;
                  navigator.clipboard?.writeText(qrData).then(() => {
                    console.info("QR data copied to clipboard");
                  });
                }}
              >
                Copy Data
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  
                  console.info("Use the download buttons under the QR preview to save PNG/SVG/JPEG.");
                }}
              >
                Download
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}
