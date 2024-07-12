import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import {
  ChatBubbleIcon,
  Pencil1Icon,
  PlusIcon,
  Share2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
import slugify from "slugify";
import { Badge } from "@/components/ui/badge";
import CommentCard from "@/components/CommentCard";
import {
  capitalizeWords,
  checkUUID,
  getCategoryWithoutBus,
  getIconByStopCategory,
  getRelativeTime,
} from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { getRecommendation } from "@/services/recommendation";
import { notFound } from "next/navigation";
import DeletePostButton from "@/components/DeletePostButton";
import { getUser } from "@/actions";
import UpvoteButton from "@/components/UpvoteButton";
import ShareButton from "@/components/ShareButton";

export default async function RecommendationPage({
  params,
}: {
  params: { recommendationId: string };
}) {
  if (!checkUUID(params.recommendationId)) {
    notFound();
  }
  const recommendation = await getRecommendation(params.recommendationId);

  const user = await getUser();

  // if (!recommendation) {
  //   notFound();
  // }

  return (
    <main className="flex flex-col items-center justify-between bg-neutral-50 pb-24">
      <div className="max-w-[700px] border-x border-b w-full min-h-[100svh] bg-background gap-4 bg-neutral-50">
        {/* <Nav /> */}
        <div className="fixed w-full md:w-fit flex flex-row bottom-0 sm:bottom-4 left-0 justify-center m-auto inset-x-0 z-50 items-center animate-in slide-in-from-bottom-full">
          <div className="sm:max-w-fit /max-w-[700px] sm:rounded-md flex flex-row justify-between sm:justify-center w-full bg-white drop-shadow-2xl border-t sm:border">
            <UpvoteButton
              recommendation={recommendation}
              className="w-full p-4 md:px-6 justify-center"
            />
            <button className="flex flex-row items-center justify-center gap-2 w-full p-4 md:px-6 border-x">
              <ChatBubbleIcon /> {recommendation.commentsCount}
            </button>
            <ShareButton recommendation={recommendation}/>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* Start Recommendation */}
          {recommendation && (
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
                    href={`/${recommendation.category.toLowerCase()}/${slugify(
                      recommendation.stop.stopName,
                      {
                        lower: true,
                        strict: true,
                      }
                    )}-${recommendation.stop.stopId}`}
                    className="flex flex-row gap-1 items-center py-1 text-sm w-fit"
                  >
                    <img
                      src={getIconByStopCategory(
                        recommendation.category as Category
                      )}
                      className="w-5 h-5"
                    />
                    <p>
                      {getCategoryWithoutBus(
                        recommendation.category.toLocaleUpperCase()
                      )}{" "}
                      {recommendation.stop.stopName}
                    </p>
                  </Link>
                </Badge>
              </div>
              {/* End Top */}

              <div className="flex flex-row gap-2 items-center px-4">
                <img
                  // src="https://ui-avatars.com/api/?name=Syahmi+Rafsan"
                  src={recommendation?.user?.image}
                  className="rounded-full w-5 h-5"
                />
                <p className="font-medium">{recommendation?.user?.name}</p>
                <p className="text-muted-foreground text-sm">
                  • {getRelativeTime(recommendation.createdAt)}
                </p>
                {/* {recommendation.createdAt !== recommendation.updatedAt && (
                  <p className="text-muted-foreground text-sm">
                    ({getRelativeTime(recommendation.updatedAt)})
                  </p>
                )} */}
              </div>
              <div className="flex flex-col gap-2 px-4">
                <p className="font-bold text-lg">{recommendation.title}</p>
                <p className="whitespace-break-spaces">
                  {recommendation.description}
                </p>
              </div>
              <div className="flex flex-row gap-1 flex-wrap px-4">
                {recommendation.highlights.map((h) => (
                  <Badge variant={"muted"} key={h}>
                    {capitalizeWords(h.replaceAll("_", " "))}
                  </Badge>
                ))}
              </div>
              {recommendation.media.length > 0 && (
                <div className="flex flex-row gap-4 overflow-x-auto px-4">
                  {recommendation.media.map((media) => (
                    <img
                      src={media.url}
                      key={media.id}
                      className="rounded-lg w-[200px] h-[133px] aspect-video object-cover shadow-sm"
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-row gap-4 justify-between px-4 pt-4">
                {user && recommendation.userId && user.id && (
                  <Link href={`/recommendation/${recommendation.id}`}>
                    <Button variant={"link"} size={"none"}>
                      <Pencil1Icon className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                )}
                <DeletePostButton recommendation={recommendation} />
              </div>
            </div>
          )}
          {/* End Recommendation */}
          {/* Start Comments */}
          <div className="bg-card border-y py-4">
            <h2 className="text-sm font-semibold px-4">
              Comments ({recommendation?.commentsCount})
            </h2>
            {recommendation?.commentsCount ||
              (0 > 0 && (
                <div>
                  <CommentCard />
                  <CommentCard />
                  <CommentCard />
                </div>
              ))}
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
