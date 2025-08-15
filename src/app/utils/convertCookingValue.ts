import { INGREDIENT_DENSITY, IngredientKey } from "./ingredient-density";

const volumeRatios: Record<string, number> = {
  "tsp": 5,
  "tbsp": 15,
  "cup-us": 240,
  "cup-metric": 250,
  "ml": 1,
  "l": 1000,
  "fl-oz-us": 29.5735,
  "pt": 473.176
};

const weightRatios: Record<string, number> = {
  "g": 1,
  "kg": 1000,
  "oz": 28.3495,
  "lb": 453.592
};

export function convertCookingValue(
  value: number,
  from: string,
  to: string,
  ingredient?: IngredientKey
): number {
  // Temperature conversions
  if (from === "c" && to === "f") return (value * 9) / 5 + 32;
  if (from === "f" && to === "c") return ((value - 32) * 5) / 9;
  if (from === "c" && to === "gas") return Math.max(1, Math.round((value - 100) / 14));
  if (from === "gas" && to === "c") return toGasMarkCelsius(value);

  // Volume ↔ weight (with ingredient density)
  if (ingredient) {
    const density = INGREDIENT_DENSITY[ingredient].gPerCup;
    if (volumeRatios[from] && weightRatios[to]) {
      const ml = value * volumeRatios[from]; // to ml
      const cups = ml / volumeRatios["cup-us"];
      return cups * density / weightRatios[to];
    }
    if (weightRatios[from] && volumeRatios[to]) {
      const grams = value * weightRatios[from];
      const cups = grams / density;
      return (cups * volumeRatios["cup-us"]) / volumeRatios[to];
    }
  }

  // Volume ↔ Volume
  if (volumeRatios[from] && volumeRatios[to]) {
    return (value * volumeRatios[from]) / volumeRatios[to];
  }

  // Weight ↔ Weight
  if (weightRatios[from] && weightRatios[to]) {
    return (value * weightRatios[from]) / weightRatios[to];
  }

  return NaN;
}

function toGasMarkCelsius(mark: number): number {
  if (mark < 1) return 135;
  if (mark > 9) return 250;
  return 135 + (mark - 1) * 14;
}
