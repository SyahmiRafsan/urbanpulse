import LoginCard from "@/components/LoginCard";
import Nav from "@/components/Nav";
import React from "react";

export default function MapPage() {
  return (
    <div className="min-h-[100svh] flex flex-col justify-center items-center p-4 bg-neutral-50">
      <div className="fixed bottom-0 w-full flex flex-row justify-center z-50">
        <Nav />
      </div>
      <div className="bg-card p-8 rounded-lg shadow-sm border">
        <LoginCard />
      </div>
    </div>
  );
}
