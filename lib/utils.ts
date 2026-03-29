import { ServingSize } from "@/types";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents);
}

export function getServingLabel(size: ServingSize): string {
  switch (size) {
    case "1":
      return "Serves 1";
    case "2":
      return "Serves 2";
    case "family":
      return "Family (Serves 4)";
  }
}

export function getServingShortLabel(size: ServingSize): string {
  switch (size) {
    case "1":
      return "1 Person";
    case "2":
      return "2 People";
    case "family":
      return "Family • 4";
  }
}

export function getPriceByServing(
  pricing: { serves1: number; serves2: number; family: number },
  size: ServingSize
): number {
  switch (size) {
    case "1":
      return pricing.serves1;
    case "2":
      return pricing.serves2;
    case "family":
      return pricing.family;
  }
}
