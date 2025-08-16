"use client";

interface ColorStop {
  offset: number;
  color: string;
}

interface LinearGradient {
  type: "linear";
  rotation: number; // in degrees
  colorStops: ColorStop[];
}

interface RadialGradient {
  type: "radial";
  colorStops: ColorStop[];
}

type Gradient = LinearGradient | RadialGradient;

interface GradientPresetsProps {
  onSelect: (gradient: Gradient) => void;
}

const PRESETS: { name: string; gradient: Gradient }[] = [
  {
    name: "Purple → Blue",
    gradient: {
      type: "linear",
      rotation: 45,
      colorStops: [
        { offset: 0, color: "#8b5cf6" },
        { offset: 1, color: "#3b82f6" },
      ],
    },
  },
  {
    name: "Pink → Orange",
    gradient: {
      type: "linear",
      rotation: 90,
      colorStops: [
        { offset: 0, color: "#ec4899" },
        { offset: 1, color: "#f97316" },
      ],
    },
  },
  {
    name: "Cyan → Purple",
    gradient: {
      type: "linear",
      rotation: 135,
      colorStops: [
        { offset: 0, color: "#06b6d4" },
        { offset: 1, color: "#9333ea" },
      ],
    },
  },
  {
    name: "Green → Blue",
    gradient: {
      type: "linear",
      rotation: 0,
      colorStops: [
        { offset: 0, color: "#22c55e" },
        { offset: 1, color: "#2563eb" },
      ],
    },
  },
  {
    name: "Sunset Glow",
    gradient: {
      type: "linear",
      rotation: 120,
      colorStops: [
        { offset: 0, color: "#facc15" },
        { offset: 0.5, color: "#f97316" },
        { offset: 1, color: "#dc2626" },
      ],
    },
  },
  {
    name: "Ocean Breeze",
    gradient: {
      type: "linear",
      rotation: 60,
      colorStops: [
        { offset: 0, color: "#0ea5e9" },
        { offset: 1, color: "#14b8a6" },
      ],
    },
  },
  {
    name: "Radial Neon",
    gradient: {
      type: "radial",
      colorStops: [
        { offset: 0, color: "#f43f5e" },
        { offset: 1, color: "#3b82f6" },
      ],
    },
  },
  {
    name: "Aurora",
    gradient: {
      type: "linear",
      rotation: 200,
      colorStops: [
        { offset: 0, color: "#22d3ee" },
        { offset: 0.5, color: "#a78bfa" },
        { offset: 1, color: "#f472b6" },
      ],
    },
  },
  {
    name: "Midnight",
    gradient: {
      type: "linear",
      rotation: 270,
      colorStops: [
        { offset: 0, color: "#0f172a" },
        { offset: 1, color: "#1e3a8a" },
      ],
    },
  },
  {
    name: "Rainbow",
    gradient: {
      type: "linear",
      rotation: 90,
      colorStops: [
        { offset: 0, color: "#ef4444" },
        { offset: 0.2, color: "#f97316" },
        { offset: 0.4, color: "#facc15" },
        { offset: 0.6, color: "#22c55e" },
        { offset: 0.8, color: "#3b82f6" },
        { offset: 1, color: "#9333ea" },
      ],
    },
  },
];

export default function GradientPresets({ onSelect }: GradientPresetsProps) {
  return (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/20">
      <label className="text-sm text-white/80 block mb-2">Gradient Presets</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PRESETS.map((preset) => {
          const gradient = preset.gradient;
          const previewStyle =
            gradient.type === "linear"
              ? {
                  backgroundImage: `linear-gradient(${gradient.rotation}deg, ${gradient.colorStops
                    .map((stop) => stop.color)
                    .join(", ")})`,
                }
              : {
                  backgroundImage: `radial-gradient(circle, ${gradient.colorStops
                    .map((stop) => stop.color)
                    .join(", ")})`,
                };

          return (
            <button
              key={preset.name}
              onClick={() => onSelect(gradient)}
              className="px-3 py-6 rounded-lg border border-white/20 text-xs text-white hover:scale-[1.03] transition shadow"
              style={previewStyle}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
