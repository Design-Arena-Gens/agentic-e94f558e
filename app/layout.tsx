import "./styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "./lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agentic n8n Studio for YouTube",
  description: "Design, simulate, and deploy AI-driven n8n automations for YouTube growth."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={cn("min-h-screen bg-slate-950", inter.className)}>
        {children}
      </body>
    </html>
  );
}
