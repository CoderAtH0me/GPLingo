import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GPLingo: AI-Powered Language Learning",
  description:
    "Learn English with GPLingo, your personal AI-powered language tutor based on GPT-4 technology. Improve your language skills through engaging chat interactions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="h-[100dvh] bg-gray-100 w-full">
            <div>{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
