"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";

interface LogoUploaderProps {
  onLogoChange: (
    dataUrl: string | undefined,
    width?: number,
    height?: number
  ) => void;
}

export default function LogoUploader({ onLogoChange }: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new window.Image();
        img.onload = () => {
          const dataUrl = event.target?.result as string;
          setPreview(dataUrl);
          onLogoChange(dataUrl, img.width, img.height);
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/20">
      <label className="block text-sm text-white/80 mb-2">Logo</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-white/70 
          file:mr-4 file:py-2 file:px-4 file:rounded-lg 
          file:border-0 file:text-sm file:font-semibold 
          file:bg-white/10 file:text-white 
          hover:file:bg-white/20"
      />

      {preview && (
        <div className="mt-4 w-[100px] h-[100px] relative">
          {/* Use next/image safely with data URLs */}
          <Image
            src={preview}
            alt="Logo preview"
            fill
            className="object-contain rounded-lg"
            sizes="100px"
            unoptimized // important for base64/dataURL images
          />
        </div>
      )}
    </div>
  );
}
