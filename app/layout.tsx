import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ginni's Fashion Studio — Indian Ethnic Wear",
  description:
    "Discover handpicked Indian ethnic wear — sarees, anarkalis, lehengas and more. Curated for every occasion, crafted with love.",
  keywords: [
    "Indian ethnic wear",
    "saree",
    "anarkali",
    "lehenga",
    "kurta set",
    "women's fashion",
    "festive wear",
  ],
  openGraph: {
    title: "Ginni's Fashion Studio",
    description:
      "Handpicked Indian ethnic wear for every occasion. Authentic quality, delivered with love.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C0392B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
