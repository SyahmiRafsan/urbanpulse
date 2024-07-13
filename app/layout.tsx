import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/AuthContext";
import ImageDialog from "@/components/ImageDialog";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UrbanPulse - Transforming Urban Living Together",
  description:
    "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <ImageDialog />
        <body className={inter.className}>{children}</body>
        {process.env.NODE_ENV == "production" && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.UMAMI_WEBSITE_ID}
          />
        )}
      </AuthProvider>
    </html>
  );
}
