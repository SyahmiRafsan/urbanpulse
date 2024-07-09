import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile | UrbanPulse",
  description:
    "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.",
};

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense>{children}</Suspense>;
}
