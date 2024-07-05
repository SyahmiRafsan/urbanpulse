import { getRecommendation } from "@/services/recommendation";
import { getStop } from "@/services/stop";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "UrbanPulse - Transforming Urban Living Together",
//   description:
//     "UrbanPulse is a community-driven platform designed to empower citizens to improve their urban environment, starting with public transport.",
// };

export async function generateMetadata({
  params,
}: {
  params: { stop_name: string };
}) {
  const stopId = params.stop_name.split("-").slice(-1)[0];

  const stop = getStop(stopId);

  return {
    title: `${stop.stop_name} | UrbanPulse`,
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
