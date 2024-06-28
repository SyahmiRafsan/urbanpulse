import RecommendationCard from "@/components/RecommendationCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChatBubbleIcon,
  ChevronDownIcon,
  SewingPinIcon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";

export default function Home() {
  const modes = [
    { label: "Bus", icon: "/icons/bus.png" },
    { label: "LRT", icon: "/icons/bus.png" },
    { label: "MRT", icon: "/icons/bus.png" },
    { label: "Monorail", icon: "/icons/bus.png" },
    { label: "KTM", icon: "/icons/bus.png" },
  ];
  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50">
      <div className="max-w-[700px] border-x w-full min-h-screen bg-background gap-5">
        <div className="flex flex-col gap-5">
          {/* Start Top */}
          <h1 className="mt-8 text-lg font-semibold px-4">Community Feed</h1>
          <div className="flex flex-row gap-4 justify-between px-4">
            <div className="flex flex-row gap-1 items-center text-sm">
              <p className="font-medium">Nearby</p>
              <ChevronDownIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-row gap-0 items-center text-muted-foreground text-sm">
              <SewingPinIcon className="w-5 h-5" />
              <p>Wangsa Maju</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center overflow-x-auto pl-4">
            <Button className="rounded-full" size={"sm"}>
              <p className="whitespace-nowrap">All Stations</p>
            </Button>
            {modes.map((md, i) => (
              <Button
                key={md.label + i}
                className="rounded-full px-5"
                variant={"outline"}
                size={"sm"}
              >
                <img src={md.icon} className="w-5 h-5 mr-1 rounded-sm" />
                <p className="">{md.label}</p>
              </Button>
            ))}
          </div>
          {/* End Top */}
          {/* Start Feed */}
          <div>
            <RecommendationCard />
            <RecommendationCard />
            <RecommendationCard />
          </div>
          {/* End Feed */}
        </div>
      </div>
    </main>
  );
}
