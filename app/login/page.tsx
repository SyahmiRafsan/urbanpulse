import Nav from "@/components/Nav";
import Link from "next/link";
import React from "react";

export default function MapPage() {
  return (
    <div className="min-h-[100svh] flex flex-col justify-center items-center p-4 bg-neutral-50">
      <div className="fixed bottom-0 w-full flex flex-row justify-center z-50">
        <Nav />
      </div>
      <div className="bg-card p-4 border flex flex-col items-center gap-4">
        <p className="text-center">Log in securedly to Urban Pulse.</p>
        <Link href={"/auth/login"}>
          <button>
            <img
              src="/google.png"
              className="hover:opacity-80 transition-all max-h-[40px]"
            />
          </button>
        </Link>
      </div>
    </div>
  );
}
