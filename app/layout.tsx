"use client"; // Mark this file as a client component

import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClientProvider
import { useState } from "react"; // For managing QueryClient instance
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";



const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            {/* Wrap the entire app with QueryClientProvider */}
            <main className=" flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-15 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  {/* Add any navigation content here */}
                </nav>
                <div className="w-full flex flex-col p-6 bg-white">{children}</div>
              </div>
            </main>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
