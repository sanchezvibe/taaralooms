import type { Metadata } from "next";
import { Lato, Great_Vibes } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Taaralooms Admin Dashboard",
  description: "Admin panel for Taaralooms management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${lato.className} ${greatVibes.variable} antialiased font-sans`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
