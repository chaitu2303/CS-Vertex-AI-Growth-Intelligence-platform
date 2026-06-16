import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "CS Vertex AI Growth Intelligence",
  description: "AI-powered lead intelligence and CRM platform for local businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${hanken.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground dark:bg-grid-white light:bg-grid-black bg-fixed">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
      </html>
    </ClerkProvider>
  );
}
