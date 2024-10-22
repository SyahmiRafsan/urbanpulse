"use client";

import Nav from "@/components/Nav";
import { useAuth } from "@/hooks/AuthContext";
import { BellIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, hasFetched, loggedIn } = useAuth();

  useEffect(() => {
    if (hasFetched && !loggedIn) {
      router.push("/login");
    }
  }, [hasFetched]);

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        <Nav />
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}

          <div className="items-start flex-col flex bg-card px-4">
            <div className="flex flex-row items-center gap-4 relative justify-start w-full">
              <div className="flex flex-row gap-1 items-center text-sm w-fit">
                <h1 className="text-lg font-semibold">Notifications</h1>
              </div>
            </div>
          </div>

          {/* End Top */}
          {/* Start Body */}
          <div className="flex flex-col gap-4 items-center pb-4 px-4 border-b min-h-[60svh] justify-center">
            <BellIcon className="w-8 h-8 text-muted-foreground" />
            <p className="font-medium">No notifications yet</p>
            <p className="text-sm max-w-sm text-center">
              You&apos;ll get updates on new comments and upvotes, when people
              interact with your posts
            </p>
            <div className="text-sm bg-neutral-100 border px-2 py-1">
              <pre>This feature is still under development.</pre>
            </div>
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}
