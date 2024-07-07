"use client";

import {
  BellIcon,
  DrawingPinIcon,
  HomeIcon,
  PersonIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreateRecommendationState } from "@/lib/constants";

export default function Nav() {
  const links = [
    { label: "Feed", url: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Map", url: "/map", icon: <DrawingPinIcon className="w-5 h-5" /> },
    {
      label: "Recommend",
      url: `/recommendation/create?mode=${CreateRecommendationState.SEARCHING}`,
      icon: <PlusIcon className="w-5 h-5" />,
    },
    {
      label: "Notifications",
      url: "/notifications",
      icon: <BellIcon className="w-5 h-5" />,
    },
    {
      label: "Account",
      url: "/account",
      icon: <PersonIcon className="w-5 h-5" />,
    },
  ];

  const pathname = usePathname();

  const showNav = pathname == "/recommendation/create" ? false : true;

  return (
    <>
      {showNav && (
        <nav className="fixed w-full md:w-fit flex flex-row bottom-0 sm:bottom-4 left-0 justify-center m-auto inset-x-0 z-50 items-center animate-in slide-in-from-bottom-full">
          <div className="sm:max-w-fit /max-w-[700px] sm:rounded-md gap-4 px-6 py-4 flex flex-row justify-between sm:justify-center w-full bg-white drop-shadow-2xl border-t sm:border">
            {links.map((link) => (
              <Link href={link.url} key={link.label}>
                <Button
                  className={cn(
                    "flex items-center p-2 rounded-lg",
                    pathname !== link.url && "text-muted-foreground",
                    link.label == "Recommend" && "text-primary-foreground"
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
      )}
    </>
  );
}
