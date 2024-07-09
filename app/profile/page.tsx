"use client";

import BackButton from "@/components/BackButton";
import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dummyRecommendations } from "@/services/recommendation";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import {
  ChatBubbleIcon,
  ExitIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("editing");
  const { recommendationDrafts } = useRecommendationStore();

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24 min-h-[100svh]">
      <div className="max-w-[700px] border-x w-full bg-background gap-4">
        {!isEditing && <Nav />}
        <div className="flex flex-col gap-4 pt-4">
          {/* Start Top */}
          {isEditing && (
            <div className="items-start flex-col flex bg-card px-4 animate-in slide-in-from-top-4">
              <div className="flex flex-row items-center gap-4 relative justify-start w-full">
                <BackButton />
                <div className="flex flex-row gap-1 items-center text-sm w-fit">
                  <h1 className="text-lg font-semibold">Edit Personal Info</h1>
                </div>
              </div>
            </div>
          )}
          {/* End Top */}
          {/* Start Body */}
          <div className="bg-neutral-50 flex flex-col gap-4">
            <div className="border-b bg-card">
              <div className="p-4 flex flex-col items-center gap-4 w-full">
                <div className="relative">
                  <img
                    src="https://pbs.twimg.com/profile_images/1617747470624382976/D4zg6xZW_400x400.jpg"
                    className="w-24 h-24 rounded-full border"
                  />
                  {isEditing && (
                    <button className="absolute top-1 bg-card rounded-full p-1 border right-0">
                      <Pencil1Icon />
                    </button>
                  )}
                </div>
                {!isEditing ? (
                  <div className="flex flex-col items-center">
                    <h1 className="font-medium text-lg">Syahmi Rafsanjani</h1>
                    <p className="text-muted-foreground">syahmi@gmail.com</p>
                  </div>
                ) : (
                  <div className="flex flex-col max-w-[400px] items-center w-full gap-4">
                    <div className="w-full">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" disabled />
                    </div>
                  </div>
                )}
                {!isEditing ? (
                  <div className="mb-4">
                    <Button
                      variant={"outline"}
                      onClick={() => router.push(`${pathname}?editing=true`)}
                    >
                      Edit Info
                    </Button>
                  </div>
                ) : (
                  <div className="w-full p-4 fixed max-w-[400px] md:static md:p-0 md:pt-4 bottom-0 animate-in slide-in-from-bottom-4 flex justify-end">
                    <Button className="w-full md:w-fit">Save</Button>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="bg-card flex flex-col md:flex-row">
                <ProfileButton
                  icon={<ChatBubbleIcon className="w-5 h-5" />}
                  label={"Send feedback"}
                />
                <ProfileButton
                  icon={<ExitIcon className="w-5 h-5" />}
                  label={"Sign out"}
                />
                <ProfileButtonDestructive
                  icon={<TrashIcon className="w-5 h-5" />}
                  label={"Delete account"}
                />
              </div>
            )}

            {!isEditing && (
              <div className="bg-card">
                <div className="border-b flex flex-row justify-between gap-4 p-4 border-t">
                  <p className="font-medium">
                    My Recommendations{" "}
                    <span className="text-muted-foreground">
                      ({dummyRecommendations.length})
                    </span>
                  </p>
                  <Link href={`/recommendation/drafts`}>
                    <Badge>
                      {recommendationDrafts.length}{" "}
                      {recommendationDrafts.length > 1 ? "drafts" : "draft"}
                    </Badge>
                  </Link>
                </div>

                <div>
                  {dummyRecommendations.length > 0 ? (
                    dummyRecommendations.map((rec) => (
                      <div key={rec.id}>
                        <RecommendationCard recommendation={rec} />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border-y flex sm:flex-row flex-col gap-4 items-center">
                      <img src="/artwork/rail.svg" className="max-w-sm" />
                      <div className="flex flex-col gap-4">
                        <p className="font-medium">
                          Post your first recommendation
                        </p>
                        <p className="text-sm text-center sm:text-left">
                          Share your ideas and make a positive impact on our
                          city&apos;s transit system
                        </p>
                        <Link
                          className="w-full mb-4 mt-2 sm:mb-0 sm:w-fit"
                          href={"/recommendation/create"}
                        >
                          <Button className="w-full sm:w-fit">
                            <PlusIcon className="mr-1" />
                            <p>Create Recommendation</p>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* End Body */}
        </div>
      </div>
    </main>
  );
}

function ProfileButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="p-4 px-8 gap-4 items-center md:justify-center md:px-4 first:border-t border-b md:border-r md:border-t w-full flex flex-row">
      {icon}
      <p className="font-medium">{label}</p>
    </button>
  );
}

function ProfileButtonDestructive({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="p-4 px-8 gap-4 items-center md:justify-center md:px-4 text-red-600 first:border-t border-b md:border-t w-full flex flex-row">
      {icon}
      <p className="font-medium">{label}</p>
    </button>
  );
}
