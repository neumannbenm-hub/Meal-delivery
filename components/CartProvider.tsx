"use client";

// This component exists to prevent hydration mismatches from Zustand's
// persist middleware, which reads from localStorage only on the client.
// Wrapping cart-aware children in a client boundary is sufficient;
// we don't need any extra logic here.

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
