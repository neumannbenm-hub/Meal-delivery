export type ServingSize = "1" | "2" | "family";
export type MealCategory = "dinner" | "breakfast" | "lunch-snack";

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
}

export interface MealPricing {
  serves1: number;
  serves2: number;
  family: number; // serves 4
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: MealCategory;
  images: string[];
  nutrition: NutritionInfo; // per serving (1 person)
  pricing: MealPricing;
  tags: string[];
  prepTime: string;
  cookTime: string;
  allergens: string[];
  ingredients: string[];
  dayOfWeek?: string; // for dinner meals
  isNew?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  id: string; // meal.id + '-' + servingSize
  meal: Meal;
  servingSize: ServingSize;
  quantity: number;
}
