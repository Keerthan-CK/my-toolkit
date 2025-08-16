"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";

interface QrPreviewProps {
  data: string;
  options?: Partial<Options>;
  size?: number;
}

const defaultOptions: Options = {
  width: 300,
  height: 300,
  type: "svg",
  data: "",
  dotsOptions: { color: "#000", type: "rounded" },
  backgroundOptions: { color: "transparent" },
  imageOptions: { crossOrigin: "anonymous", margin: 8 },
};

export default function QrPreview({
  data,
  options = {},
  size = 300,
}: QrPreviewProps) {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // capture initial props so mount effect doesn't reference changing props directly
  const initial = useRef<{ data: string; options: Partial<Options>; size: number }>({
    data,
    options,
    size,
  });

  // initialize QRCodeStyling once on mount
  useEffect(() => {
    const initOpts: Partial<Options> = {
      ...defaultOptions,
      ...initial.current.options,
      width: initial.current.size,
      height: initial.current.size,
      data: initial.current.data,
    };

    qrCode.current = new QRCodeStyling(initOpts);

    const container = qrRef.current;
    if (container && qrCode.current) {
      container.innerHTML = "";
      qrCode.current.append(container);
    }

    return () => {
      if (container) container.innerHTML = "";
      qrCode.current = null;
    };
  }, []);

  // update QR when data/options/size change
  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data,
      width: size,
      height: size,
      ...options,
    });
  }, [data, options, size]);

  const handleDownload = (ext: FileExtension) => {
    qrCode.current?.download({ extension: ext });
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div
        ref={qrRef}
        className="flex justify-center items-center"
        style={{ width: size, height: size }}
      />

      <div className="flex gap-2 flex-wrap justify-center mt-2">
        {(["png", "svg", "jpeg"] as FileExtension[]).map((ext) => (
          <button
            key={ext}
            onClick={() => handleDownload(ext)}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition text-xs sm:text-sm"
          >
            {ext.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
