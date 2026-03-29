import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-stone-900">
            Checkout Cancelled
          </h1>
          <p className="text-stone-500">
            No worries — your cart is still saved. Head back whenever you&apos;re
            ready.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Return to Menu
        </Link>
      </div>
    </div>
  );
}
