"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getServingLabel, getPriceByServing } from "@/lib/utils";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    const lineItems = items.map((item) => ({
      name: `${item.meal.name} — ${getServingLabel(item.servingSize)}`,
      image: item.meal.images[0],
      price: getPriceByServing(item.meal.pricing, item.servingSize),
      quantity: item.quantity,
    }));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-900">
            Your Order
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-stone-400">
                ({items.reduce((c, i) => c + i.quantity, 0)} items)
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-stone-700">Your cart is empty</p>
                <p className="text-sm text-stone-400 mt-1">
                  Browse this week&apos;s menu and add some meals.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Browse Menu &rarr;
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = getPriceByServing(item.meal.pricing, item.servingSize);
              return (
                <div key={item.id} className="flex gap-4 bg-stone-50 rounded-xl p-3">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                    <Image
                      src={item.meal.images[0]}
                      alt={item.meal.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm leading-snug truncate">
                      {item.meal.name}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {getServingLabel(item.servingSize)}
                    </p>
                    <p className="text-sm font-bold text-stone-900 mt-1">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity + remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-300 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-bold flex items-center justify-center transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-stone-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-bold flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm">Subtotal</span>
              <span className="font-bold text-stone-900 text-lg">
                {formatPrice(getTotal())}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
            >
              Proceed to Checkout &rarr;
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
