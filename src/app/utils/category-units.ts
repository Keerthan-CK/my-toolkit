export type UnitOption = {
  value: string;
  label: string;
};

export type Category =
  | "Length"
  | "Area"
  | "Mass"
  | "Volume"
  | "Power";

export const CATEGORY_UNITS: Record<Category, UnitOption[]> = {
  Length: [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "in", label: "Inches (in)" },
    { value: "ft", label: "Feet (ft)" },
    { value: "m", label: "Meters (m)" },
    { value: "km", label: "Kilometers (km)" },
    { value: "mi", label: "Miles (mi)" },
  ],
  Area: [
    { value: "m2", label: "Square meters (m²)" },
    { value: "ac", label: "Acres" },
  ],
  Mass: [
    { value: "g", label: "Grams (g)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "lb", label: "Pounds (lb)" },
    { value: "t", label: "Tonnes (t)" },
  ],
  Volume: [
    { value: "l", label: "Liters (L)" },
    { value: "gal-imp", label: "Gallons (UK)" },
  ],
  Power: [
    { value: "hp", label: "Horsepower (HP)" },
    { value: "W", label: "Watts (W)" },
    { value: "cc", label: "Engine capacity (cc)" },
  ],
};
