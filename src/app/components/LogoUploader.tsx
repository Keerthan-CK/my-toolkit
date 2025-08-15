"use client";

import { useRef, useState } from "react";
import Image from "next/image"

interface LogoUploaderProps {
  onLogoChange: (logoDataUrl?: string) => void;
}

export default function LogoUploader({ onLogoChange }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limit: 1MB
    if (file.size > 1024 * 1024) {
      alert("Please upload an image smaller than 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onLogoChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setPreview(undefined);
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/20 flex flex-col gap-3">
      <label className="text-sm text-white/80">QR Logo / Icon</label>

      {preview ? (
        <div className="flex flex-col items-center gap-2">
          <Image
            src={preview}
            alt="Logo Preview"
            className="w-16 h-16 object-contain rounded bg-white/10 p-1"
          />
          <button
            onClick={handleRemoveLogo}
            className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30 transition"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/60 text-sm">No logo selected</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
          >
            Upload
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
