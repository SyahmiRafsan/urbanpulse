import React from "react";
import Link from "next/link";

export default function LoginCard() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        Login securedly with Google to continue using Urban Pulse.
      </p>
      <Link href={"/auth/login"}>
        <button>
          <img
            src="/google.png"
            className="hover:opacity-80 transition-all max-h-[40px]"
          />
        </button>
      </Link>
    </div>
  );
}
