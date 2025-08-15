import { useState, useEffect } from "react";
import { buildQrData, QrType, QrPayload } from "@/app/utils/buildQrData";

interface QRFormData {
  url?: string;
  text?: string;
  ssid?: string;
  password?: string;
  encryption?: "WPA" | "WEP" | "nopass";
  email?: string;
  subject?: string;
  body?: string;
  name?: string;
  phone?: string;
}

interface QrControlsProps {
  onChange: (
    data: string,
    options: {
      dotsOptions: { color: string; type: "rounded" | "square" | "dots" | "extra-rounded" };
      backgroundOptions: { color: string };
    }
  ) => void;
}

const qrTypes: { value: QrType; label: string }[] = [
  { value: "url", label: "Website / URL" },
  { value: "text", label: "Plain Text" },
  { value: "wifi", label: "Wi-Fi Network" },
  { value: "email", label: "Email" },
  { value: "vcard", label: "Contact (vCard)" },
];

export default function QrControls({ onChange }: QrControlsProps) {
  const [type, setType] = useState<QrType>("url");
  const [formData, setFormData] = useState<QRFormData>({});
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("transparent");

useEffect(() => {
  const payload: QrPayload = { ...formData, type } as QrPayload; 
  const data = buildQrData(type, payload);

  onChange(data, {
    dotsOptions: { color: fgColor, type: "rounded" },
    backgroundOptions: { color: bgColor },
  });
}, [type, formData, fgColor, bgColor, onChange]);


  const handleFieldChange = <K extends keyof QRFormData>(
    field: K,
    value: QRFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur border border-white/20">
      {/* QR Type Selector */}
      <div>
        <label className="block text-sm text-white/80 mb-1">QR Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as QrType)}
          className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-indigo-400"
        >
          {qrTypes.map((t) => (
            <option key={t.value} value={t.value} className="text-gray-900">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Fields */}
      {type === "url" && (
        <input
          type="text"
          placeholder="https://example.com"
          value={formData.url || ""}
          onChange={(e) => handleFieldChange("url", e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
        />
      )}

      {type === "text" && (
        <textarea
          placeholder="Enter your text"
          value={formData.text || ""}
          onChange={(e) => handleFieldChange("text", e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
        />
      )}

      {type === "wifi" && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Network Name (SSID)"
            value={formData.ssid || ""}
            onChange={(e) => handleFieldChange("ssid", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={(e) => handleFieldChange("password", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
          <select
            value={formData.encryption || "WPA"}
            onChange={(e) =>
              handleFieldChange(
                "encryption",
                e.target.value as QRFormData["encryption"]
              )
            }
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          >
            <option value="WPA" className="text-gray-900">WPA/WPA2</option>
            <option value="WEP" className="text-gray-900">WEP</option>
            <option value="nopass" className="text-gray-900">No Password</option>
          </select>
        </div>
      )}

      {type === "email" && (
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="recipient@example.com"
            value={formData.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject || ""}
            onChange={(e) => handleFieldChange("subject", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
          <input
            type="text"
            placeholder="Body"
            value={formData.body || ""}
            onChange={(e) => handleFieldChange("body", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
        </div>
      )}

      {type === "vcard" && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone || ""}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2"
          />
        </div>
      )}

      {/* Color Pickers */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm text-white/80 mb-1">
            Foreground Color
          </label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-full h-10 rounded border border-white/20 bg-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-white/80 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded border border-white/20 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
