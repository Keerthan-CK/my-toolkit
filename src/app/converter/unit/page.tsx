"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import convert from "convert-units";
import { motion } from "framer-motion";
import Image from "next/image";

const CC_PER_HP = 15;

type Category = "Length" | "Area" | "Mass" | "Volume" | "Power";
type FieldSide = "from" | "to";

type UnitOption = { value: string; label: string };

const CATEGORY_UNITS: Record<Category, UnitOption[]> = {
  Length: [
    { value: "cm", label: "cm" },
    { value: "in", label: "inch" },
    { value: "ft", label: "ft" },
    { value: "m", label: "m" },
    { value: "km", label: "km" },
    { value: "mi", label: "miles" },
  ],
  Area: [
    { value: "m2", label: "sq m" },
    { value: "ac", label: "acre" },
  ],
  Mass: [
    { value: "g", label: "g" },
    { value: "oz", label: "oz" },
    { value: "kg", label: "kg" },
    { value: "lb", label: "lb" },
    { value: "t", label: "tonne" },
  ],
  Volume: [
    { value: "l", label: "L" },
    { value: "gal-imp", label: "gallon (UK)" },
  ],
  Power: [
    { value: "hp", label: "HP" },
    { value: "W", label: "Watt" },
    { value: "cc", label: "cc (engine)" },
  ],
};

function customConvert(value: number, from: string, to: string): number | null {
  if (from === "hp" && to === "cc") return value * CC_PER_HP;
  if (from === "cc" && to === "hp") return value / CC_PER_HP;

  if (from === "ac" && to === "m2") return value * 4046.8564224;
  if (from === "m2" && to === "ac") return value / 4046.8564224;

  if (from === "l" && to === "gal-imp") return value / 4.54609;
  if (from === "gal-imp" && to === "l") return value * 4.54609;

  return null;
}

function convertValue(value: number, from: string, to: string): number {
  if (from === to) return value;
  const custom = customConvert(value, from, to);
  if (custom !== null) return custom;
  try {
    return convert(value)
      .from(from as convert.Unit)
      .to(to as convert.Unit);
  } catch {
    return NaN;
  }
}

function useDebounced<T>(val: T, delay = 250) {
  const [debounced, setDebounced] = useState(val);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(val), delay);
    return () => clearTimeout(id);
  }, [val, delay]);
  return debounced;
}


export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("Length");

  const defaultUnits = useMemo(() => {
    switch (category) {
      case "Length":
        return { from: "cm", to: "in" };
      case "Area":
        return { from: "ac", to: "m2" };
      case "Mass":
        return { from: "kg", to: "lb" };
      case "Volume":
        return { from: "l", to: "gal-imp" };
      case "Power":
        return { from: "hp", to: "W" };
    }
  }, [category]);

  const [fromUnit, setFromUnit] = useState(defaultUnits.from);
  const [toUnit, setToUnit] = useState(defaultUnits.to);

  useEffect(() => {
    setFromUnit(defaultUnits.from);
    setToUnit(defaultUnits.to);
  }, [defaultUnits]);

  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");
  const [activeField, setActiveField] = useState<FieldSide>("from");

  const [stateColor, setStateColor] = useState<
    "neutral" | "loading" | "error" | "success"
  >("neutral");

  const dFromValue = useDebounced(fromValue, 250);
  const dToValue = useDebounced(toValue, 250);
  const dFromUnit = useDebounced(fromUnit, 100);
  const dToUnit = useDebounced(toUnit, 100);
  const dActive = useDebounced(activeField, 100);

  const updatingRef = useRef(false);

  useEffect(() => {
    if (updatingRef.current) return;

    const raw = dActive === "from" ? dFromValue : dToValue;
    const parsed = Number(raw);
    if (!isFinite(parsed)) {
      setStateColor("error");
      return;
    }

    const result =
      dActive === "from"
        ? convertValue(parsed, dFromUnit, dToUnit)
        : convertValue(parsed, dToUnit, dFromUnit);

    if (isFinite(result)) {
      updatingRef.current = true;
      if (dActive === "from") setToValue(result.toString());
      else setFromValue(result.toString());
      updatingRef.current = false;
      setStateColor("success");
    } else {
      setStateColor("error");
    }
  }, [dFromValue, dToValue, dFromUnit, dToUnit, dActive]);


  const boxBg =
    stateColor === "error"
      ? "bg-red-100"
      : stateColor === "success"
      ? "bg-green-100"
      : "bg-gray-100";

  const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-purple-400 transition-shadow";

  const unitList = CATEGORY_UNITS[category];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      {/* Background Wallpaper */}
      <Image
        src="/images/background.jpg"
        alt="Background wallpaper"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/50"></div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-lg sm:max-w-2xl"
      >
        <div className="rounded-2xl p-5 sm:p-8 bg-white/20 backdrop-blur-xl border border-white/20 shadow-xl">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Image
              src="/images/unit.png"
              alt="Units animation"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow"
              loading="lazy"
            />
          </div>

          <h1 className="text-center text-xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            Universal Unit Converter
          </h1>

          {/* Category Selector */}
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block mb-2 text-xl font-bold  text-green-500 text-pretty"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={`w-full rounded-lg border border-transparent bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 
     font-bold text-rose-600 px-4 py-3 backdrop-blur-sm ${focusRing}
      hover:from-fuchsia-500/50 hover:to-cyan-500/50 transition`}
            >
              {(Object.keys(CATEGORY_UNITS) as Category[]).map((c) => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Conversion Inputs */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* From */}
            <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
              <label className="text-sm text-white/80">From</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={fromValue}
                  onChange={(e) => {
                    setActiveField("from");
                    setFromValue(e.target.value);
                  }}
                  className={`flex-1 rounded-xl border border-white/20 bg-white/10 text-white px-3 py-3 ${focusRing}`}
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => {
                    setActiveField("from");
                    setFromUnit(e.target.value);
                  }}
                  className={`w-full sm:w-auto min-w-[6rem] max-w-full rounded-xl border border-transparent 
    bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 text-rose-600 text-pretty font-bold px-3 py-3 backdrop-blur-sm 
    ${focusRing} hover:from-fuchsia-500/50 hover:to-cyan-500/50 transition`}
                >
                  {unitList.map((u) => (
                    <option
                      key={u.value}
                      value={u.value}
                      className="text-black"
                    >
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* To */}
            <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
              <label className="text-sm text-white/80">To</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={toValue}
                  onChange={(e) => {
                    setActiveField("to");
                    setToValue(e.target.value);
                  }}
                  className={`flex-1 rounded-xl border border-white/20 bg-white/10 text-white px-3 py-3 ${focusRing}`}
                  placeholder="Result"
                />
                <select
                  value={toUnit}
                  onChange={(e) => {
                    setActiveField("to");
                    setToUnit(e.target.value);
                  }}
                  className={`w-full sm:w-auto min-w-[6rem] max-w-full rounded-xl border border-transparent 
    bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 text-rose-600 text-pretty font-bold px-3 py-3 backdrop-blur-sm 
    ${focusRing} hover:from-fuchsia-500/50 hover:to-cyan-500/50 transition`}
                >
                  {unitList.map((u) => (
                    <option
                      key={u.value}
                      value={u.value}
                      className="text-black"
                    >
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>

          {/* Result Preview */}
<div
  className={`mt-6 rounded-xl px-4 py-3 text-sm sm:text-base font-medium ${boxBg} text-green-500 text-center`}
>
  {stateColor === "error" ? (
    "Unsupported or invalid conversion. Try different units."
  ) : (
    `${Number(fromValue).toLocaleString(undefined, {
      maximumSignificantDigits: 5,
    })} ${
      unitList.find((u) => u.value === fromUnit)?.label
    } = ${Number(toValue).toLocaleString(undefined, {
      maximumSignificantDigits: 5,
    })} ${
      unitList.find((u) => u.value === toUnit)?.label
    }`
  )}
</div>

        </div>
      </motion.div>
    </div>
  );
}
