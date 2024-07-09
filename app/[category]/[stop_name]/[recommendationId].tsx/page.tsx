import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { getRecommendation } from "@/services/recommendation";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

import slugify from "slugify";
import { Badge } from "@/components/ui/badge";
import CommentCard from "@/components/CommentCard";
import { getCategoryWithoutBus, getIconByStopCategory } from "@/lib/utils";
import BackButton from "@/components/BackButton";

export default function RecommendationPage({
  params,
}: {
  params: { stop_name: string };
}) {
  const stopId = params.stop_name.split("-").slice(-1)[0];

  const recommendation = getRecommendation(stopId);

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24">
      <div className="max-w-[700px] border-x w-full min-h-screen bg-background gap-4 bg-neutral-50">
        <Nav />
        <div className="flex flex-col gap-4">
          {/* Start Recommendation */}
          <div className="bg-card border-b py-4 flex flex-col gap-4">
            {/* Start Top */}
            <div className="items-start flex-col flex bg-card px-4">
              <div className="flex flex-row items-center gap-4 relative justify-start w-full pb-2">
                <BackButton />
                <div className="flex flex-row gap-1 items-center text-sm w-fit">
                  <h1 className="text-lg font-semibold">Recommendation</h1>
                </div>
              </div>

              <Badge variant={"outline"} className="w-fit">
                <Link
                  href={`/${recommendation.category}/${slugify(
                    recommendation.stop_name,
                    {
                      lower: true,
                      strict: true,
                    }
                  )}-${recommendation.stop_id}`}
                  className="flex flex-row gap-1 items-center py-1 text-sm w-fit"
                >
                  <img
                    src={getIconByStopCategory(
                      recommendation.category as Category
                    )}
                    className="w-5 h-5"
                  />
                  <p>{getCategoryWithoutBus(recommendation.category.toLocaleUpperCase())}{" "}{recommendation.stop_name}</p>
                </Link>
              </Badge>
            </div>
            {/* End Top */}

            <div className="flex flex-row gap-2 items-center px-4">
              <img
                src="https://ui-avatars.com/api/?name=Syahmi+Rafsan"
                className="rounded-full w-5 h-5"
              />
              <p className="font-medium">SyahmiRafsan</p>
              <p className="text-muted-foreground text-sm">• 4h ago</p>
            </div>
            <div className="flex flex-col gap-2 px-4">
              <p className="font-bold text-lg">{recommendation.title}</p>
              <p className="">
                Please add ramps to help wheel-chaired people like my grandma.
              </p>
            </div>
            <div className="flex flex-row gap-1 flex-wrap px-4">
              <Badge variant={"muted"}>Quality of Life</Badge>
              <Badge variant={"muted"}>Safety</Badge>
              <Badge variant={"muted"}>Connectivity</Badge>
            </div>
            <div className="flex flex-row gap-4 overflow-x-auto px-4">
              {[1, 2, 3].map((img) => (
                <img
                  src={recommendation.media[0].url}
                  key={img}
                  className="rounded-lg max-h-[200px]"
                />
              ))}
            </div>
          </div>
          {/* End Recommendation */}
          {/* Start Comments */}
          <div className="bg-card border-t pt-4">
            <h2 className="text-lg font-semibold px-4">
              Comments ({recommendation.commentsCount})
            </h2>
            <div>
              <CommentCard />
              <CommentCard />
              <CommentCard />
            </div>
          </div>
          {/* End Comments */}
          {/* Start CTA */}
          <div className="bg-card p-4 py-6 border-y flex flex-col gap-4 items-center">
            <p className="font-medium">
              Share your thoughts on this recommendation
            </p>
            <Button>
              <PlusIcon className="mr-1" />
              Add Comment
            </Button>
          </div>
          {/* End CTA */}
        </div>
      </div>
    </main>
  );
}
