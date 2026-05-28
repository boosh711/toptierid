import type { Metadata } from "next";
import { Inter, Russo_One } from "next/font/google";
import { ComplianceBanner } from "@/components/compliance-banner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const russo = Russo_One({ weight: "400", subsets: ["latin"], variable: "--font-russo" });

export const metadata: Metadata = {
  title: "TOP TIER ID — Direct Connection. No Middlemen.",
  description: "Recruiting platform connecting high school athletes with college coaches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${russo.variable}`}>
      <body className="font-sans">
        <ComplianceBanner />
        {children}
      </body>
    </html>
  );
}
