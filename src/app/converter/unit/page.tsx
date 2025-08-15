"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CATEGORY_UNITS } from "@/app/utils/category-units";
import { convertValue } from "@/app/utils/convetValue";
import { focusRing, boxBg } from "@/app/utils/styles/theme";

type Category = keyof typeof CATEGORY_UNITS;

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState(CATEGORY_UNITS["Length"][0].value);
  const [toUnit, setToUnit] = useState(CATEGORY_UNITS["Length"][1].value);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [stateColor, setStateColor] = useState<"ok" | "error">("ok");

  const unitList = CATEGORY_UNITS[category];

  function fmt(num: number) {
    return Number(num).toLocaleString(undefined, { maximumSignificantDigits: 5 });
  }

  function handleConvert(value: string, field: "from" | "to") {
    const num = parseFloat(value);
    if (isNaN(num)) {
      if (field === "from") setToValue("");
      else setFromValue("");
      return;
    }
    try {
      if (field === "from") {
        const result = convertValue(num, fromUnit, toUnit);
        setToValue(result.toString());
        setStateColor("ok");
      } else {
        const result = convertValue(num, toUnit, fromUnit);
        setFromValue(result.toString());
        setStateColor("ok");
      }
    } catch {
      setStateColor("error");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background wallpaper */}
      <Image
        src="/images/background.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Content card */}
      <div className="relative z-10 max-w-2xl w-full p-6 rounded-2xl bg-black/60 shadow-xl backdrop-blur-lg border border-white/10">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/unit.png"
            alt="Unit Converter Icon"
            width={90}
            height={90}
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
          Universal Unit Converter – Made Easy
        </h1>

        {/* Category Selector */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 mb-6">
          <label className="text-sm text-white/90 sm:mt-2">
            Pick a measurement type:
          </label>
          <div className="sm:col-span-2">
            <select
              value={category}
              onChange={(e) => {
                const cat = e.target.value as Category;
                setCategory(cat);
                setFromUnit(CATEGORY_UNITS[cat][0].value);
                setToUnit(CATEGORY_UNITS[cat][1]?.value || CATEGORY_UNITS[cat][0].value);
              }}
              className={`w-full rounded-xl border border-white/20 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 text-blue-500 font-bold px-3 py-2 shadow-inner hover:shadow-lg transition ${focusRing}`}
            >
              {(Object.keys(CATEGORY_UNITS) as Category[]).map((c) => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* From Value */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 mb-6">
          <label className="text-sm text-white/90 sm:mt-2">Convert from</label>
          <div className="sm:col-span-2">
            <input
              type="number"
              value={fromValue}
              onChange={(e) => {
                setFromValue(e.target.value);
                handleConvert(e.target.value, "from");
              }}
              placeholder="Enter value here"
              className={`w-full rounded-xl border border-white/20 bg-white/10 text-white px-3 py-2 mb-1 shadow-inner ${focusRing}`}
            />
          </div>
        </div>

        {/* From Unit Selector */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 mb-6">
          <label className="text-sm text-white/90 sm:mt-2">From unit</label>
          <div className="sm:col-span-2">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className={`w-full rounded-xl border border-white/20 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 text-blue-500 px-3 py-2 shadow-inner hover:shadow-lg transition ${focusRing}`}
            >
              {unitList.map((u) => (
                <option key={u.value} value={u.value} className="text-black">
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* To Unit Selector */}
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4 mb-6">
          <label className="text-sm text-white/90 sm:mt-2">To unit</label>
          <div className="sm:col-span-2">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className={`w-full rounded-xl border border-white/20 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 text-blue-500 px-3 py-2 shadow-inner hover:shadow-lg transition ${focusRing}`}
            >
              {unitList.map((u) => (
                <option key={u.value} value={u.value} className="text-black">
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Preview */}
        <div
          className={`mt-6 rounded-xl px-4 py-3 text-sm sm:text-base font-medium ${boxBg} ${
            stateColor === "error" ? "text-red-400" : "text-green-300"
          } text-center shadow-inner`}
        >
          {stateColor === "error"
            ? "That conversion doesn’t seem to work. Try another combo."
            : `${fmt(Number(fromValue))} ${
                unitList.find((u) => u.value === fromUnit)?.label ?? ""
              } = ${fmt(Number(toValue))} ${
                unitList.find((u) => u.value === toUnit)?.label ?? ""
              }`}
        </div>
      </div>
    </div>
  );
}
