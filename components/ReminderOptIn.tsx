"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export default function ReminderOptIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setErrorMsg("Please enter at least an email or phone number.");
      return;
    }
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center space-y-1">
        <p className="text-2xl">✅</p>
        <p className="font-semibold text-green-800">You&apos;re on the list!</p>
        <p className="text-sm text-green-700">
          We&apos;ll remind you every week when the new menu drops.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 space-y-4">
      <div>
        <p className="font-bold text-stone-900 text-base">
          Get weekly reminders
        </p>
        <p className="text-sm text-stone-500 mt-0.5">
          We&apos;ll text or email you every Monday when the new menu is live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="First name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="tel"
          placeholder="Phone number for SMS (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {errorMsg && (
          <p className="text-xs text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          {state === "loading" ? "Signing up…" : "Remind me each week"}
        </button>

        <p className="text-xs text-stone-400 text-center">
          No spam. Unsubscribe any time.
        </p>
      </form>
    </div>
  );
}
