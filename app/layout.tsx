import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";
import { Navbar } from "@/components/ui/Navbar";
import { CartDrawer } from "@/components/shop/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Urban Grail — Streetwear",
  description: "Premium streetwear crafted for those who move with intent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white`}>
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
