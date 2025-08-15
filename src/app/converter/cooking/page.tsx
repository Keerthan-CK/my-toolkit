"use client";

import { useState } from "react";
import { COOKING_UNITS, CookingCategory } from "@/app/utils/cooking-units";
import {
  INGREDIENT_DENSITY,
  IngredientKey,
} from "@/app/utils/ingredient-density";
import { convertCookingValue } from "@/app/utils/convertCookingValue";
import Image from "next/image";

export default function CookingConverter() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("cup-us");
  const [toUnit, setToUnit] = useState("g");
  const [ingredient, setIngredient] = useState<IngredientKey | "">("");

  const categoryFrom = getCategory(fromUnit);
  const categoryTo = getCategory(toUnit);

  const needsIngredient =
    (categoryFrom === "volume" && categoryTo === "weight") ||
    (categoryFrom === "weight" && categoryTo === "volume");

  const result = convertCookingValue(
    value,
    fromUnit,
    toUnit,
    needsIngredient ? (ingredient as IngredientKey) : undefined
  );

  return (
    <div
      className="min-h-screen bg-center bg-cover flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/images/cook.jpg')" }}
    >
      <div className="w-full max-w-lg bg-black/50 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/cook.png"
            alt="cook icon"
            width={64}
            height={64}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Cooking Converter
        </h2>

        {/* FROM */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="number"
            className="flex-1 p-3 rounded-lg bg-black/30 text-white placeholder-white/70 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            placeholder="Enter value"
          />
          <select
            className="p-3 rounded-lg bg-black/40 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {renderUnitOptions()}
          </select>
        </div>

        {/* TO */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            readOnly
            className="flex-1 p-3 rounded-lg bg-black/30 text-yellow-200 border border-yellow-400"
            value={Number.isNaN(result) ? "" : result.toFixed(2)}
          />
          <select
            className="p-3 rounded-lg bg-black/40 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {renderUnitOptions()}
          </select>
        </div>

        {/* INGREDIENT SELECTOR */}
        {needsIngredient && (
          <select
            className="w-full p-3 mb-4 rounded-lg bg-black/40 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value as IngredientKey)}
          >
            <option value="">Select Ingredient</option>
            {Object.keys(INGREDIENT_DENSITY).map((key) => (
              <option key={key} value={key}>
                {key[0].toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function renderUnitOptions() {
  return Object.entries(COOKING_UNITS).map(([cat, units]) => (
    <optgroup key={cat} label={cat.toUpperCase()}>
      {units.map((u) => (
        <option key={u.value} value={u.value}>
          {u.label}
        </option>
      ))}
    </optgroup>
  ));
}

function getCategory(unit: string): CookingCategory {
  for (const cat in COOKING_UNITS) {
    if (COOKING_UNITS[cat as CookingCategory].some((u) => u.value === unit)) {
      return cat as CookingCategory;
    }
  }
  throw new Error("Unknown unit: " + unit);
}
