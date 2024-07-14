"use client";

import React from "react";
import { useAuth } from "@/hooks/AuthContext";
import Logo from "./Logo";

export default function LoginCard() {
  const { login } = useAuth();
  return (
    <div className="flex flex-col items-center gap-4">
      <Logo />
      <p className="text-center mt-2">
        Login securedly with Google to continue using Urban Pulse.
      </p>
      <button onClick={() => login()}>
        <img
          src="/google.png"
          className="hover:opacity-80 transition-all max-h-[40px]"
        />
      </button>
      <p className="text-sm text-muted-foreground text-center mt-2">
        By logging in, you agree to our{" "}
        <a href="/privacy-policy" target="_blank" className="underline">
          privacy policy
        </a>{" "}
        &{" "}
        <a href="/terms-of-service" target="_blank" className="underline">
          terms of service
        </a>
        .
      </p>
    </div>
  );
}
