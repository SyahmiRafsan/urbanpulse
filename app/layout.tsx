import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/AuthContext";
import ImageDialog from "@/components/ImageDialog";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const title = "UrbanPulse - Transforming Urban Living Together";
const description =
  "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.";
const image = {
  url: "https://urbanpulse.asia/urbanpulse_og.png", // Must be an absolute URL
  width: 1200,
  height: 734,
};

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://urbanpulse.asia",
    siteName: "UrbanPulse",
    images: [image],
    locale: "en_UK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    site: "https://urbanpulse.asia",
  },
  keywords: [
    "public transport malaysia",
    "public transportation malaysia",
    "public transport malaysia map",
  ],
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
