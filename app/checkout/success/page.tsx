import Link from "next/link";
import ReminderOptIn from "@/components/ReminderOptIn";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Confirmation */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">
              Order Confirmed!
            </h1>
            <p className="text-stone-500 mt-2 leading-relaxed">
              Thank you for your order. You&apos;ll receive a confirmation email
              shortly with delivery details and recipe cards.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-left space-y-2">
            <p className="text-sm font-semibold text-orange-800">
              What happens next?
            </p>
            <ul className="text-sm text-orange-700 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                We source your fresh ingredients from local farms
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                Your meals are prepped and packed with care
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                Delivered to your door on your scheduled day
              </li>
            </ul>
          </div>
        </div>

        {/* Reminder opt-in */}
        <ReminderOptIn />

        <div className="text-center">
          <Link
            href="/"
            className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            &larr; Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
