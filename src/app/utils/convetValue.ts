// Conversion factors based on meters, square meters, grams, liters, watts
const lengthFactors: Record<string, number> = {
  cm: 0.01,
  in: 0.0254,
  ft: 0.3048,
  m: 1,
  km: 1000,
  mi: 1609.344,
};

const areaFactors: Record<string, number> = {
  "m2": 1,
  ac: 4046.8564224,
};

const massFactors: Record<string, number> = {
  g: 0.001,
  oz: 0.0283495,
  kg: 1,
  lb: 0.453592,
  t: 1000,
};

const volumeFactors: Record<string, number> = {
  l: 1,
  "gal-imp": 4.54609,
};

const powerFactors: Record<string, number> = {
  hp: 745.7,
  W: 1,
  cc: 1, 
};

export function convertValue(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  let factors: Record<string, number>;

  if (lengthFactors[fromUnit] && lengthFactors[toUnit]) {
    factors = lengthFactors;
  } else if (areaFactors[fromUnit] && areaFactors[toUnit]) {
    factors = areaFactors;
  } else if (massFactors[fromUnit] && massFactors[toUnit]) {
    factors = massFactors;
  } else if (volumeFactors[fromUnit] && volumeFactors[toUnit]) {
    factors = volumeFactors;
  } else if (powerFactors[fromUnit] && powerFactors[toUnit]) {
    factors = powerFactors;
  } else {
    throw new Error("Unsupported conversion");
  }

  return (value * factors[fromUnit]) / factors[toUnit];
}
