import MealCard from "@/components/MealCard";
import { getDinners, getBreakfasts, getLunchSnacks } from "@/lib/meals";

export default function HomePage() {
  const dinners = getDinners();
  const breakfasts = getBreakfasts();
  const lunchSnacks = getLunchSnacks();

  const weekLabel = "March 30 – April 5, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 py-6">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Week of {weekLabel}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight tracking-tight">
          This Week&apos;s Menu
        </h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto">
          Chef-crafted dinners, breakfasts, and snacks — pre-prepped and
          delivered fresh to your door. Choose your serving size at checkout.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-500 pt-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Locally sourced ingredients
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Pre-prepped &amp; easy to cook
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Serves 1, 2, or the whole family
          </div>
        </div>
      </section>

      {/* Dinners */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">
              This Week&apos;s Dinners
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              One featured dinner per night, Monday through Sunday.
            </p>
          </div>
          <span className="text-sm text-stone-400 hidden sm:block">
            {dinners.length} meals
          </span>
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dinners.map((meal) => (
            <MealCard key={meal.id} meal={meal} showDay />
          ))}
        </div>
      </section>

      {/* Add-Ons */}
      <section id="add-ons" className="scroll-mt-20">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Add-On Options
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900">
            Breakfast &amp; Lunch / Snacks
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Round out your week with morning starters and midday options.
          </p>
        </div>

        {/* Breakfasts */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">🌅</span> Breakfast
          </h3>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {breakfasts.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>

        {/* Lunch / Snacks */}
        <div>
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">🥗</span> Lunch &amp; Snacks
          </h3>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {lunchSnacks.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12">
        <h2 className="text-2xl font-extrabold text-stone-900 text-center mb-10">
          How It Works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          {[
            {
              step: "1",
              icon: "🛒",
              title: "Browse & Order",
              desc: "Pick your meals and choose serving size — 1, 2, or Family (4).",
            },
            {
              step: "2",
              icon: "📦",
              title: "We Prep & Deliver",
              desc: "Ingredients arrive fresh, pre-measured, and ready to cook.",
            },
            {
              step: "3",
              icon: "🍽️",
              title: "Cook & Enjoy",
              desc: "Follow simple step-by-step instructions and enjoy in 30 min or less.",
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="space-y-3">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                {icon}
              </div>
              <h3 className="font-bold text-stone-900 text-lg">{title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
