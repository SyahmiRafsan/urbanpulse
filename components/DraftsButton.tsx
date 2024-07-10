"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { Badge } from "./ui/badge";
import { useDraftStore } from "@/stores/DraftStore";
import { useAuth } from "@/hooks/AuthContext";

export default function DraftsButton() {
  const { hasFetched, loggedIn } = useAuth();

  const { recommendationDrafts } = useDraftStore();
  return (
    <>
      {hasFetched && loggedIn && (
        <Link href={`/recommendation/drafts`}>
          <Badge>
            {recommendationDrafts.length}{" "}
            {recommendationDrafts.length > 1 ? "drafts" : "draft"}
          </Badge>
        </Link>
      )}
    </>
  );
}
