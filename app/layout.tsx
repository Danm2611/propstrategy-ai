import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropStrategy AI - Investment-Grade Property Analysis",
  description: "Get comprehensive property development analysis powered by AI. Analyze multiple exit strategies, development costs, and optimal investment approaches in minutes.",
  icons: {
    icon: "/propstrategylogo.png",
    apple: "/propstrategylogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-8">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  © {new Date().getFullYear()} PropStrategy AI. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <a href="/privacy" className="hover:underline">Privacy</a>
                  <a href="/terms" className="hover:underline">Terms</a>
                  <a href="/contact" className="hover:underline">Contact</a>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
