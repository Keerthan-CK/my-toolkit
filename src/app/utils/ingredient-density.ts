export const INGREDIENT_DENSITY = {
  flour: { gPerCup: 120 },
  sugar: { gPerCup: 200 },
  butter: { gPerCup: 227 },
  rice: { gPerCup: 185 },
  milk: { gPerCup: 240 }
} as const;

export type IngredientKey = keyof typeof INGREDIENT_DENSITY;
