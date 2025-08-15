export const COOKING_UNITS = {
  volume: [
    { value: "tsp", label: "teaspoon (tsp)" },
    { value: "tbsp", label: "tablespoon (tbsp)" },
    { value: "cup-us", label: "cup (US)" },
    { value: "cup-metric", label: "cup (metric)" },
    { value: "ml", label: "milliliter (ml)" },
    { value: "l", label: "liter (L)" },
    { value: "fl-oz-us", label: "fluid ounce (US fl oz)" },
    { value: "pt", label: "pint (pt)" }
  ],
  weight: [
    { value: "g", label: "gram (g)" },
    { value: "kg", label: "kilogram (kg)" },
    { value: "oz", label: "ounce (oz)" },
    { value: "lb", label: "pound (lb)" }
  ],
  temperature: [
    { value: "c", label: "Celsius (°C)" },
    { value: "f", label: "Fahrenheit (°F)" },
    { value: "gas", label: "Gas Mark" }
  ]
} as const;

export type CookingCategory = keyof typeof COOKING_UNITS;
