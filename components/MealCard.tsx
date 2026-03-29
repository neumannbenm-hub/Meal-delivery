"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Meal, ServingSize } from "@/types";
import { formatPrice, getPriceByServing } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

const SIZES: { value: ServingSize; label: string }[] = [
  { value: "1", label: "1 Person" },
  { value: "2", label: "2 People" },
  { value: "family", label: "Family" },
];

interface MealCardProps {
  meal: Meal;
  showDay?: boolean;
}

export default function MealCard({ meal, showDay = false }: MealCardProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAdd = (size: ServingSize) => {
    addItem(meal, size, false); // silent add — no sidebar pop
    setShowPicker(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Tappable area → detail page */}
      <Link href={`/meals/${meal.id}`} className="group block flex-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <Image
            src={meal.images[0]}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {showDay && meal.dayOfWeek && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {meal.dayOfWeek}
            </div>
          )}
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

        <div className="p-4 pb-3">
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
            {meal.name}
          </h3>
          <p className="text-stone-500 text-sm mt-1 line-clamp-2">
            {meal.description}
          </p>

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
      </Link>

      {/* Quick-add — outside the Link so clicks don't navigate */}
      <div className="px-4 pb-4">
        {added ? (
          <div className="flex items-center justify-center gap-1.5 h-9 text-sm font-semibold text-green-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to cart
          </div>
        ) : showPicker ? (
          <div className="space-y-2">
            <p className="text-xs text-stone-400 text-center">Pick a serving size</p>
            <div className="grid grid-cols-3 gap-1.5">
              {SIZES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleAdd(value)}
                  className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl bg-stone-50 hover:bg-orange-50 border border-stone-200 hover:border-orange-300 transition-colors"
                >
                  <span className="text-xs font-semibold text-stone-700">
                    {label}
                  </span>
                  <span className="text-xs font-bold text-orange-600">
                    {formatPrice(getPriceByServing(meal.pricing, value))}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPicker(false)}
              className="w-full text-xs text-stone-400 hover:text-stone-500 transition-colors py-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors text-sm font-semibold"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Order
          </button>
        )}
      </div>
    </div>
  );
}
