"use client";

import { updateUserInfo } from "@/actions";
import BackButton from "@/components/BackButton";
import DraftsButton from "@/components/DraftsButton";
import Nav from "@/components/Nav";
import RecommendationCard from "@/components/RecommendationCard";
import RecommendationSkeleton from "@/components/RecommendationSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/AuthContext";
import { getRecommendationsByUserId } from "@/services/recommendation";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import {
  ChatBubbleIcon,
  ExitIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("editing");

  const router = useRouter();
  const { user, setName, hasFetched, loggedIn, logout } = useAuth();
  const [userName, setUserName] = useState(user?.name);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (hasFetched && !loggedIn) {
      router.push("/login");
    }
  }, [hasFetched]);

  const { setRecommendationsUser, recommendationsUser, hasFetchedUser } =
    useRecommendationStore();

  useEffect(() => {
    async function getRecs(userId: string) {
      const list: Recommendation[] = await getRecommendationsByUserId(userId);

      setRecommendationsUser(list);
    }
    if (!hasFetchedUser && user) {
      getRecs(user.id);
      setUserName(user.name);
    }
  }, [hasFetched]);

  async function handleUpdate() {
    setIsLoading(true);
    if (userName) {
      const update = await updateUserInfo(userName);

      setName(userName);
      router.push(`${pathname}`);
    }
    setIsLoading(false);
  }

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
                    src={user?.image}
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
                    <h1 className="font-medium text-lg">{user?.name}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                ) : (
                  <div className="flex flex-col max-w-[400px] items-center w-full gap-4">
                    <div className="w-full">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        disabled
                        value={user?.email}
                      />
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
                    <Button
                      className="w-full md:w-fit"
                      onClick={() => handleUpdate()}
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <UpdateIcon className="animate-spin mr-1" />
                      )}{" "}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="bg-card flex flex-col md:flex-row border-t md:border-t-0">
                <ProfileButton
                  icon={<ChatBubbleIcon className="w-5 h-5" />}
                  label={"Send feedback"}
                />

                <div onClick={() => logout()} className="w-full">
                  <ProfileButton
                    icon={<ExitIcon className="w-5 h-5" />}
                    label={"Sign out"}
                  />
                </div>

                <ProfileButtonDestructive
                  icon={<TrashIcon className="w-5 h-5" />}
                  label={"Delete account"}
                />
              </div>
            )}

            {!isEditing && (
              <div className="">
                <div className="bg-card sticky top-0 border-b flex flex-row justify-between gap-4 p-4 border-t">
                  <p className="font-medium">
                    My Recommendations{" "}
                    <span className="text-muted-foreground">
                      ({recommendationsUser.length})
                    </span>
                  </p>
                  <DraftsButton />
                </div>

                <div>
                  {hasFetchedUser ? (
                    recommendationsUser.length > 0 ? (
                      recommendationsUser.map((rec) => (
                        <div key={rec.id} className="bg-card">
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
                    )
                  ) : (
                    [1, 2, 3].map((s) => <RecommendationSkeleton key={s} />)
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
    <button className="p-4 px-8 gap-4 items-center md:justify-center md:px-4 border-b md:border-r md:border-t w-full flex flex-row">
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
