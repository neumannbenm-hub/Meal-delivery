import { NutritionInfo } from "@/types";

interface NutritionCardProps {
  nutrition: NutritionInfo;
}

const stats = [
  { key: "calories" as keyof NutritionInfo, label: "Calories", unit: "kcal", color: "bg-orange-100 text-orange-700" },
  { key: "protein" as keyof NutritionInfo, label: "Protein", unit: "g", color: "bg-blue-100 text-blue-700" },
  { key: "carbs" as keyof NutritionInfo, label: "Carbs", unit: "g", color: "bg-amber-100 text-amber-700" },
  { key: "fat" as keyof NutritionInfo, label: "Fat", unit: "g", color: "bg-yellow-100 text-yellow-700" },
  { key: "fiber" as keyof NutritionInfo, label: "Fiber", unit: "g", color: "bg-green-100 text-green-700" },
  { key: "sodium" as keyof NutritionInfo, label: "Sodium", unit: "mg", color: "bg-stone-100 text-stone-600" },
];

export default function NutritionCard({ nutrition }: NutritionCardProps) {
  return (
    <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
      <p className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">
        Nutrition Facts
        <span className="ml-2 text-xs font-normal text-stone-400 normal-case tracking-normal">
          per serving
        </span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ key, label, unit, color }) => (
          <div
            key={key}
            className={`${color} rounded-xl p-3 text-center`}
          >
            <p className="text-lg font-bold leading-none">
              {nutrition[key]}
              <span className="text-xs font-medium ml-0.5">{unit}</span>
            </p>
            <p className="text-xs mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
