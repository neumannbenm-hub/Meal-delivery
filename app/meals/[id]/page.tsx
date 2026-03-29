"use client";

import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getMealById } from "@/lib/meals";
import { useCartStore } from "@/lib/cart-store";
import { ServingSize } from "@/types";
import { formatPrice, getServingLabel, getPriceByServing } from "@/lib/utils";
import PhotoGallery from "@/components/PhotoGallery";
import NutritionCard from "@/components/NutritionCard";
import ServingSelector from "@/components/ServingSelector";

export default function MealDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const meal = getMealById(params.id);
  if (!meal) notFound();

  const [serving, setServing] = useState<ServingSize>("2");
  const { addItem } = useCartStore();
  const router = useRouter();

  const price = getPriceByServing(meal.pricing, serving);

  const categoryLabel =
    meal.category === "dinner"
      ? "Dinner"
      : meal.category === "breakfast"
      ? "Breakfast"
      : "Lunch / Snack";

  const handleAddToCart = () => {
    addItem(meal, serving);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Menu
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Photo gallery */}
        <div className="space-y-6">
          <PhotoGallery images={meal.images} altText={meal.name} />
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          {/* Category + badges */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wide">
              {categoryLabel}
            </span>
            {meal.dayOfWeek && (
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                {meal.dayOfWeek}&apos;s Dinner
              </span>
            )}
            {meal.isNew && (
              <span className="text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full">
                New
              </span>
            )}
            {meal.isPopular && (
              <span className="text-xs font-bold text-white bg-stone-800 px-3 py-1 rounded-full">
                Popular
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">
            {meal.name}
          </h1>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed">{meal.longDescription}</p>

          {/* Quick info */}
          <div className="flex flex-wrap gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{meal.prepTime} prep · {meal.cookTime} cook</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {meal.tags.map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Serving selector */}
          <ServingSelector
            pricing={meal.pricing}
            selected={serving}
            onChange={setServing}
          />

          {/* Add to cart */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart — {formatPrice(price)}
            </button>
          </div>
          <p className="text-xs text-stone-400 -mt-2">
            {getServingLabel(serving)} · Free delivery on orders over $60
          </p>

          {/* Nutrition */}
          <NutritionCard nutrition={meal.nutrition} />

          {/* Ingredients */}
          <div>
            <p className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
              Ingredients
            </p>
            <div className="flex flex-wrap gap-2">
              {meal.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-white border border-stone-200 text-stone-600 text-xs px-3 py-1.5 rounded-full"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {meal.allergens.length > 0 && meal.allergens[0] !== "None" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">
                ⚠ Contains Allergens
              </p>
              <p className="text-sm text-amber-700">
                {meal.allergens.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
