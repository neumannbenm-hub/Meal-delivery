import Image from "next/image";
import Link from "next/link";
import { Meal } from "@/types";
import { formatPrice } from "@/lib/utils";

interface MealCardProps {
  meal: Meal;
  showDay?: boolean;
}

export default function MealCard({ meal, showDay = false }: MealCardProps) {
  return (
    <Link href={`/meals/${meal.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <Image
            src={meal.images[0]}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Day badge */}
          {showDay && meal.dayOfWeek && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {meal.dayOfWeek}
            </div>
          )}
          {/* New / Popular badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {meal.isNew && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                New
              </span>
            )}
            {meal.isPopular && (
              <span className="bg-stone-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
            {meal.name}
          </h3>
          <p className="text-stone-500 text-sm mt-1 line-clamp-2">
            {meal.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meal.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
            <div>
              <p className="text-xs text-stone-400">From</p>
              <p className="text-lg font-bold text-stone-900">
                {formatPrice(meal.pricing.serves1)}
              </p>
            </div>
            <div className="text-right text-xs text-stone-400">
              {meal.cookTime === "0 min" ? (
                <p>Ready to serve</p>
              ) : (
                <p>{meal.cookTime}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
