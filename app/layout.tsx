import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import CartProvider from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "FreshTable — Weekly Meal Delivery",
  description:
    "Fresh, chef-prepared meals delivered to your door. View this week's menu and order dinners, breakfasts, and snacks for 1, 2, or the whole family.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
