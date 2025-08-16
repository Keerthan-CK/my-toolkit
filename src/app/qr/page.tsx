"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Options } from "qr-code-styling";
import { debounce } from "lodash";
import GradientPresets from "@/app/components/GradientPresets";

import ResponsiveLayout from "@/app/components/ResponsiveLayout";
import QrControls from "@/app/components/QrControls";
import QrPreview from "@/app/components/QrPreview";
import LogoUploader from "@/app/components/LogoUploader";
import AdvancedSettings from "@/app/components/AdvancedSettings";
import { embedImageInQr } from "@/app/utils/embedImageInQr";

export default function QrGeneratorPage() {
  const [qrData, setQrData] = useState("https://example.com");
  const [baseOptions, setBaseOptions] = useState<Partial<Options>>({
    dotsOptions: { color: "#000", type: "rounded" },
    backgroundOptions: { color: "transparent" },
  });
  const [advancedOptions, setAdvancedOptions] = useState<Partial<Options>>({});
  const [logoData, setLogoData] = useState<{
    url?: string;
    width?: number;
    height?: number;
  }>({});
  const [size, setSize] = useState(300);

  /** Handle changes from QrControls */
  const handleControlsChange = useCallback(
    (data: string, options: Partial<Options>) => {
      if (data !== qrData) setQrData(data);
      if (JSON.stringify(options) !== JSON.stringify(baseOptions)) {
        setBaseOptions(options);
      }
    },
    [qrData, baseOptions]
  );

  /** Debounced version for smoother updates */
  const debouncedHandleControlsChange = useMemo(
    () => debounce(handleControlsChange, 300),
    [handleControlsChange]
  );

  useEffect(() => {
    return () => debouncedHandleControlsChange.cancel();
  }, [debouncedHandleControlsChange]);

  /** Advanced settings merge */
  const handleAdvancedSettings = (settings: Partial<Options>) => {
    setAdvancedOptions((prev) => ({ ...prev, ...(settings || {}) }));
  };

  /** Final merged QR options */
  const mergedOptions = useMemo(() => {
    const combined: Partial<Options> = {
      width: size,
      height: size,
      ...baseOptions,
      ...advancedOptions,
      imageOptions: {
        imageSize: logoData.width ? Math.min(0.3, logoData.width / size) : 0.2,
        margin: 5,
        ...(baseOptions.imageOptions || {}),
        ...(advancedOptions.imageOptions || {}),
      },
    };
    return embedImageInQr(
      combined,
      logoData.url,
      logoData.width,
      logoData.height
    );
  }, [baseOptions, advancedOptions, logoData, size]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      {/* Page header */}
<div className="max-w-7xl mx-auto p-4 sm:p-6">
  <motion.h1
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="text-center text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-300 mb-1 "
  >
    QR Code Generator <p><span>By 𝓚</span></p>
  </motion.h1>
</div>


      {/* Main content */}
      <ResponsiveLayout
        left={
          <div className="space-y-6">
            <QrControls onChange={debouncedHandleControlsChange} />

            <div className="grid grid-cols-1 gap-4">
              <LogoUploader
                onLogoChange={(url, width, height) =>
                  setLogoData({ url, width, height })
                }
              />
              <AdvancedSettings onSettingsChange={handleAdvancedSettings} />

                  <GradientPresets
              onSelect={(gradient) =>
                setBaseOptions((prev) => ({
                  ...prev,
                  dotsOptions: {
                    ...prev.dotsOptions,
                    gradient,
                    color: undefined,
                  }, // replace solid
                }))
              }
            />

              {/* Size slider */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/20">
                <label className="block text-sm text-white/80 mb-2">
                  Preview size
                </label>
                <input
                  type="range"
                  min={120}
                  max={800}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-2 text-xs text-white/70">
                  Size: {size}px — larger sizes are better for printing.
                </div>
              </div>
            </div>

          </div>
        }
        right={
          <div className="w-full flex flex-col items-center gap-6">
           
            {/* Preview panel */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/20 flex justify-center items-center">
              <QrPreview data={qrData} options={mergedOptions} size={size} />
            </div>


            {/* Extra buttons */}
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
                onClick={() =>
                  console.info(
                    "Use download buttons under QR preview to save PNG/SVG/JPEG."
                  )
                }
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
