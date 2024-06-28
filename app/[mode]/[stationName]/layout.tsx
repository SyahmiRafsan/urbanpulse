import { getRecommendation } from "@/services/recommendation";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "UrbanPulse - Transforming Urban Living Together",
//   description:
//     "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.",
// };

export async function generateMetadata({
  params,
}: {
  params: { stationName: string };
}) {
  const recommendation = getRecommendation(params.stationName);

  return {
    title: `${recommendation.stationName} | UrbanPulse`,
    description:
      "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
