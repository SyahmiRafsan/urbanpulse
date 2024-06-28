import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, DrawingPinIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { dummyRecommendations } from "@/services/recommendation";

export default function Home() {
  const modes = [
    { label: "Bus", icon: "/icons/bus.png" },
    { label: "LRT", icon: "/icons/bus.png" },
    { label: "MRT", icon: "/icons/bus.png" },
    { label: "Monorail", icon: "/icons/bus.png" },
    { label: "KTM", icon: "/icons/bus.png" },
  ];



  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24">
      <div className="max-w-[700px] border-x w-full bg-background gap-5">
        <Nav />
        <div className="flex flex-col gap-5 pt-4">
          {/* Start Top */}
          <h1 className="text-lg font-semibold px-4">Community Feed</h1>
          <div className="flex flex-row gap-4 justify-between px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-row items-center">
                  <p className="font-medium">Nearby</p>
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                  <DropdownMenuItem>Nearby</DropdownMenuItem>
                  <DropdownMenuItem>Latest</DropdownMenuItem>
                  <DropdownMenuItem>Most upvoted</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-row gap-1 items-center text-muted-foreground text-sm">
              <DrawingPinIcon className="w-5 h-5" />
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
            {dummyRecommendations.map((rec) => (
              <div key={rec.id}>
                <RecommendationCard recommendation={rec} />
              </div>
            ))}
          </div>
          {/* End Feed */}
        </div>
      </div>
    </main>
  );
}
