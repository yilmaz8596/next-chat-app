import type { Metadata } from "next";
import "./globals.css";
import { Yanone_Kaffeesatz } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/useAuthContext";

export const metadata: Metadata = {
  title: "Whispr",
  description: "Generated by create next app",
};

const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@200;300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className={`font-sans bg-background text-foreground ${yanone.className}`}
        >
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
