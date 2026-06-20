import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MortgageFlowAI",
  description: "Explainable mortgage workflow automation by Ruthvik Uttarala"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
