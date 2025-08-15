"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";

interface QrPreviewProps {
  data: string; 
  options?: Partial<Options>; 
}

const defaultOptions: Options = {
  width: 300,
  height: 300,
  type: "svg",
  data: " ", 
  dotsOptions: {
    color: "#000",
    type: "rounded",
  },
  backgroundOptions: {
    color: "transparent",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 8,
  },
};

export default function QrPreview({ data, options = {} }: QrPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      ...defaultOptions,
      ...options,
      data,
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, [data, options]); 

  
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data,
        ...options,
      });
    }
  }, [data, options]);

  // Download handler
  const handleDownload = (ext: FileExtension) => {
    qrCode.current?.download({ extension: ext });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {/* QR Code Display */}
      <div
        ref={qrRef}
        className="bg-white/5 p-4 rounded-2xl shadow-lg backdrop-blur w-full flex justify-center"
      />

      {/* Download Buttons */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(["png", "svg", "jpeg"] as FileExtension[]).map((ext) => (
          <button
            key={ext}
            onClick={() => handleDownload(ext)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition text-sm"
          >
            {ext.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
