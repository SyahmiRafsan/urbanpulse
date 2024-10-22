"use client";

import {
  BellIcon,
  HomeIcon,
  PersonIcon,
  PlusIcon,
  SewingPinIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreateRecommendationState } from "@/lib/constants";
import { useAuth } from "@/hooks/AuthContext";

export default function Nav() {
  const { user } = useAuth();

  const links = [
    { label: "Feed", url: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Map", url: "/map", icon: <SewingPinIcon className="w-5 h-5" /> },
    {
      label: "Recommend",
      url: `/recommendation/create?mode=${CreateRecommendationState.SEARCHING}`,
      icon: <PlusIcon className="w-5 h-5" />,
    },
    {
      label: "Notifications",
      url: user ? "/notifications" : "/login",
      icon: <BellIcon className="w-5 h-5" />,
    },
    {
      label: "Profile",
      url: user ? "/profile" : "/login",
      icon: <PersonIcon className="w-5 h-5" />,
    },
  ];

  const pathname = usePathname();

  return (
    <nav className="fixed w-full md:w-fit flex flex-row bottom-0 sm:bottom-4 left-0 justify-center m-auto inset-x-0 z-50 items-center animate-in slide-in-from-bottom-full">
      <div className="sm:max-w-fit /max-w-[700px] sm:rounded-md gap-4 px-6 py-4 flex flex-row justify-between sm:justify-center w-full bg-white drop-shadow-2xl border-t sm:border">
        {links.map((link) => (
          <Link href={link.url} key={link.label}>
            <Button
              className={cn(
                "flex items-center p-2 rounded-lg",
                pathname !== link.url && "text-muted-foreground opacity-70",
                link.label == "Recommend" &&
                  "text-primary-foreground opacity-100"
              )}
              size={"icon"}
              variant={link.label == "Recommend" ? "default" : "ghost"}
            >
              {link.icon}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
