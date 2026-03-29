"use client";

import { ServingSize } from "@/types";
import { MealPricing } from "@/types";
import { formatPrice, getServingLabel } from "@/lib/utils";

interface ServingSelectorProps {
  pricing: MealPricing;
  selected: ServingSize;
  onChange: (size: ServingSize) => void;
}

const sizes: { value: ServingSize; icon: string }[] = [
  { value: "1", icon: "👤" },
  { value: "2", icon: "👥" },
  { value: "family", icon: "🏠" },
];

export default function ServingSelector({
  pricing,
  selected,
  onChange,
}: ServingSelectorProps) {
  const priceMap: Record<ServingSize, number> = {
    "1": pricing.serves1,
    "2": pricing.serves2,
    family: pricing.family,
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
        Serving Size
      </p>
      <div className="grid grid-cols-3 gap-3">
        {sizes.map(({ value, icon }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                isSelected
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold leading-tight">
                {getServingLabel(value)}
              </span>
              <span
                className={`text-sm font-bold ${
                  isSelected ? "text-orange-600" : "text-stone-900"
                }`}
              >
                {formatPrice(priceMap[value])}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
