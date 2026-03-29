"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type State = "loading" | "success" | "error" | "missing";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<State>(token ? "loading" : "missing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState("success");
        } else {
          setErrorMsg(data.error ?? "Something went wrong.");
          setState("error");
        }
      })
      .catch(() => {
        setErrorMsg("Network error.");
        setState("error");
      });
  }, [token]);

  return (
    <div className="max-w-sm w-full text-center space-y-5">
      {state === "loading" && (
        <>
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-stone-500">Processing your request…</p>
        </>
      )}

      {state === "success" && (
        <>
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-4xl">
            👋
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              You&apos;re unsubscribed
            </h1>
            <p className="text-stone-500 mt-2 text-sm">
              You won&apos;t receive any more weekly reminders from FreshTable.
              You can re-subscribe after your next order.
            </p>
          </div>
        </>
      )}

      {(state === "error" || state === "missing") && (
        <>
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              {state === "missing" ? "Invalid link" : "Error"}
            </h1>
            <p className="text-stone-500 mt-2 text-sm">
              {state === "missing"
                ? "This unsubscribe link is missing a token. Please use the link from your reminder email or SMS."
                : errorMsg}
            </p>
          </div>
        </>
      )}

      <Link
        href="/"
        className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
      >
        &larr; Back to Menu
      </Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        }
      >
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
