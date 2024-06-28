import { cn } from "@/lib/utils";
import {
  BellIcon,
  CardStackIcon,
  HomeIcon,
  PersonIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Nav() {
  const links = [
    { label: "Home", url: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Feed", url: "/", icon: <CardStackIcon className="w-5 h-5" /> },
    {
      label: "Recommend",
      url: "/recommend",
      icon: <PlusIcon className="w-5 h-5" />,
    },
    {
      label: "Notifications",
      url: "/",
      icon: <BellIcon className="w-5 h-5" />,
    },
    { label: "Account", url: "/", icon: <PersonIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed w-full flex flex-row bottom-0 items-center">
      <div className="max-w-[700px] gap-4 px-6 py-4 flex flex-row justify-between sm:justify-center w-full bg-white drop-shadow-2xl border-t sm:border">
        {links.map((link) => (
          <Link href={link.url} key={link.label}>
            <Button
              className={"flex items-center p-2 rounded-lg"}
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
