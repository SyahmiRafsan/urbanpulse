"use client";

import React from "react";
import { useAuth } from "@/hooks/AuthContext";
import Logo from "./Logo";

export default function LoginCard() {
  const { login } = useAuth();
  return (
    <div className="flex flex-col items-center gap-4">
      <Logo />
      <p className="text-center mt-4">
        Login securedly with Google to continue using Urban Pulse.
      </p>

      <button onClick={() => login()}>
        <img
          src="/google.png"
          className="hover:opacity-80 transition-all max-h-[40px]"
        />
      </button>
    </div>
  );
}
