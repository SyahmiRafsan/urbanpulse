import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Public Transport Improvement Recommendation | UrbanPulse",
  description:
    "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.",
};

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
