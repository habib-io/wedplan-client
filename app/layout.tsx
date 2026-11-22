import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "WedPlan",
  description: "Wedding planning platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans antialiased">
        <Navbar />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}