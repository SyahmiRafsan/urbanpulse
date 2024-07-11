"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useDraftStore } from "@/stores/DraftStore";
import { RecommendationHighlights } from "@/lib/constants";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Cross1Icon, ReloadIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { createRecommendation, updateRecommendation } from "@/actions";
import { useAuth } from "@/hooks/AuthContext";
import DeletePostButton from "./DeletePostButton";
import {
  capitalizeWords,
  getArrayDifferences,
  getBlobFromUrl,
} from "@/lib/utils";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import slugify from "slugify";

export default function RecommendationForm({
  initialRecommendation,
}: {
  initialRecommendation?: Recommendation;
}) {
  const { selectedStop, setSelectedStop } = useStopSearchStore();
  const { updateDraft, addDraft, removeDraft } = useDraftStore();
  const {
    setRecommendations,
    setRecommendationsUser,
    recommendations,
    recommendationsUser,
  } = useRecommendationStore();
  const { user } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const isDraft = searchParams.get("draft");

  const [isLoading, setIsLoading] = useState(false);

  // TODO enabled media for draft
  const [oldMedia, setOldMedia] = useState<Media[]>(
    isDraft ? [] : initialRecommendation ? initialRecommendation.media : []
  );

  const [recommendation, setRecommendation] = useState<Recommendation>(
    initialRecommendation
      ? {
          ...initialRecommendation,
          stopId: initialRecommendation.stop.stopId || "",
          highlights: initialRecommendation.highlights.map(
            (hl) => capitalizeWords(hl.replace(/_/g, " ")) // Replace `_` with space
          ),
          media: isDraft ? [] : initialRecommendation.media,
        }
      : {
          id: uuidv4(),
          stopName: selectedStop?.stop_name || "",
          stopId: selectedStop?.stop_id || "",
          stop: {
            id: "",
            stopName: selectedStop?.stop_name || "",
            stopId: selectedStop?.stop_id || "",
          },
          title: "",
          description: "",
          upvotesCount: 0,
          commentsCount: 0,
          category: selectedStop?.category || "",
          highlights: [],
          media: [],
          createdAt: DateTime.now().toJSDate(),
          userId: user?.id || "",
        }
  );

  useEffect(() => {
    if (selectedStop) {
      setRecommendation((prev) => ({
        ...prev,
        stopName: selectedStop.stop_name,
        stopId: selectedStop.stop_id,
      }));
    }
  }, [selectedStop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecommendation((prev) => ({ ...prev, [name]: value }));
  };

  const toggleHighlight = (highlight: RecommendationHighlights) => {
    setRecommendation((prev) => {
      const currentHighlights = prev.highlights;
      // .split(",").filter(Boolean);
      let newHighlights;
      if (currentHighlights.includes(highlight)) {
        newHighlights = currentHighlights.filter((c) => c !== highlight);
      } else if (currentHighlights.length < 3) {
        newHighlights = [...currentHighlights, highlight];
      } else {
        return prev;
      }
      return { ...prev, highlights: newHighlights };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - recommendation.media.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (user) {
      const newMediaPromises = filesToAdd.map(async (file) => {
        return {
          id: uuidv4(),
          file: file,
          url: URL.createObjectURL(file),
          mediaId: recommendation.id,
          createdAt: DateTime.now().toJSDate(),
          mediaType: "RECOMMENDATION" as MediaType,
          userId: user.id,
          mimeType: file.type,
        };
      });

      try {
        const newMedia = await Promise.all(newMediaPromises);
        setRecommendation((prev) => ({
          ...prev,
          media: [...prev.media, ...newMedia].slice(0, 3),
        }));
      } catch (error) {
        alert(`Error processing files: ${JSON.stringify(error)}`);
      }
    }
  };

  const removeFile = (id: string) => {
    setRecommendation((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    try {
      e.preventDefault();

      if (recommendation.highlights.length == 0) {
        throw Error("Please select at least one highlight.");
      }

      const formData = new FormData();

      // Append form fields
      Object.entries(recommendation).forEach(([key, value]) => {
        if (key !== "media" && key !== "highlights") {
          formData.append(key, value as string);
        }
      });

      // Append media files
      const mediaPromises = recommendation.media.map(async (media) => {
        if (media.file) {
          if (media.url.startsWith("blob:")) {
            const blob = await getBlobFromUrl(media.url);
            formData.append(
              `media_${media.id}`,
              blob,
              `${media.id}.${media.mimeType.split("/")[1]}`
            );
          } else {
            formData.append(
              `media_${media.id}`,
              media.file,
              `${media.id}.${media.mimeType.split("image/")[1]}`
            );
          }
        }
      });

      const oldMediaPromises = oldMedia.map(async (media) => {
        if (media.file) {
          if (media.url.startsWith("blob:")) {
            const blob = await getBlobFromUrl(media.url);
            formData.append(
              `old_media_${media.id}`,
              blob,
              `${media.id}.${media.mimeType.split("/")[1]}`
            );
          } else {
            formData.append(
              `old_media_${media.id}`,
              media.file,
              `${media.id}.${media.mimeType.split("image/")[1]}`
            );
          }
        }
      });

      await Promise.all([...mediaPromises, ...oldMediaPromises]);

      const { added, deleted } = getArrayDifferences(
        oldMedia,
        recommendation.media
      );

      formData.append("mediaDeleted", JSON.stringify(deleted));
      formData.append("mediaAdded", JSON.stringify(added));

      // Append highlights
      formData.append("highlights", recommendation.highlights.join(","));

      // Call createRecommendation or updateRecommendation based on isDraft
      let result = recommendation;
      if (isDraft) {
        const newRecommendation = await createRecommendation(formData);

        removeDraft(recommendation);

        setRecommendations([newRecommendation, ...recommendations], false);
        setRecommendationsUser(
          [newRecommendation, ...recommendationsUser],
          false
        );

        result = newRecommendation;
      } else {
        const updatedRecommendation = await updateRecommendation(formData);

        setRecommendations(
          recommendations.map((rc) =>
            rc.id == recommendation.id
              ? { ...updatedRecommendation, media: recommendation.media }
              : rc
          ),
          false
        );

        setRecommendationsUser(
          recommendationsUser.map((rc) =>
            rc.id == recommendation.id
              ? { ...updatedRecommendation, media: recommendation.media }
              : rc
          ),
          false
        );

        result = updatedRecommendation;
      }

      if (result) {
        router.push(
          `/${recommendation.category.toLowerCase()}/${slugify(
            recommendation.stop.stopName,
            { lower: true, strict: true }
          )}-${recommendation.stopId}/${recommendation.id}`
        );
      }

      router.refresh();
      setSelectedStop(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`${error}`);
      setIsLoading(false);
    }
  };

  function handleCancel() {
    if (initialRecommendation) {
      updateDraft({ ...recommendation, createdAt: DateTime.now().toJSDate() });
    } else {
      addDraft({ ...recommendation, createdAt: DateTime.now().toJSDate() });
    }

    if (initialRecommendation) {
      router.replace("/recommendation/drafts");
    } else {
      router.replace("/recommendation/drafts");
    }

    setSelectedStop(null);
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
      // action={createRecommendation}
    >
      <div className="flex flex-col gap-4 border-b pb-6 px-4">
        <Label htmlFor="title" className="leading-6">
          Title of your recommendation
        </Label>
        <Textarea
          placeholder="Title"
          id="title"
          name="title"
          required
          value={recommendation.title}
          onChange={handleInputChange}
          rows={1}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground">
          {(recommendation.title && recommendation.title.split("").length) || 0}
          /100 words
        </p>
      </div>
      <div className="flex flex-col gap-4 border-b pb-6 px-4">
        <Label htmlFor="description" className="leading-6">
          Describe your recommendation to help make public transport
          improvements
        </Label>
        <Textarea
          placeholder="Enter a description..."
          id="description"
          name="description"
          required
          value={recommendation.description}
          onChange={handleInputChange}
          rows={4}
          maxLength={2500}
        />
        <p className="text-xs text-muted-foreground">
          {(recommendation.description &&
            recommendation.description.split("").length) ||
            0}
          /2500 words
        </p>
      </div>
      <div className="flex flex-col gap-4 border-b pb-6 px-4">
        <Label className="leading-6">
          Select up to 3 highlights to describe your recommendation
        </Label>

        <div className="flex flex-wrap gap-2">
          {Object.values(RecommendationHighlights).map((hl) => (
            <Button
              className={`rounded-full ${
                recommendation.highlights
                  // .map((hl) => hl.replaceAll("_"," ").toLowerCase())
                  .includes(hl)
                  ? "border-neutral-600"
                  : "font-normal"
              }`}
              key={hl}
              // variant={
              //   recommendation.highlights.includes(hl)
              //     ? "default"
              //     : "outline"
              // }
              variant={"outline"}
              disabled={
                recommendation.highlights.length == 3 &&
                !recommendation.highlights.includes(hl)
              }
              type="button"
              onClick={() => toggleHighlight(hl)}
            >
              {hl}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-b pb-6">
        <Label className="leading-6 px-4" htmlFor="picture">
          Upload up to 3 photos (optional)
        </Label>
        <div className="px-4">
          <Input
            id="picture"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            disabled={recommendation.media.length == 3}
          />
        </div>

        {recommendation.media.length > 0 && (
          <div className="flex flex-row gap-4 overflow-x-auto px-4 pb-4">
            {recommendation.media.map((media) => (
              <div
                key={media.id}
                className="relative flex-shrink-0 animate-in slide-in-from-top-4 transition-all"
              >
                <img
                  src={media.url}
                  className="rounded-lg w-[200px] h-[133px] aspect-video object-cover shadow-sm"
                />
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => removeFile(media.id)}
                  className="absolute top-2 right-2 rounded-full"
                  size={"icon"}
                >
                  <Cross1Icon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDraft ? (
        <div className="flex flex-col sm:flex-row justify-end gap-4 px-4">
          {initialRecommendation && (
            <DeletePostButton recommendation={recommendation} />
          )}
          {!isLoading && (
            <Button
              variant={"outline"}
              type="button"
              onClick={() => handleCancel()}
            >
              Save
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-1 animate-spin" />} Post
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-end gap-4 px-4">
          <DeletePostButton recommendation={recommendation} />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-1 animate-spin" />} Update
          </Button>
        </div>
      )}
    </form>
  );
}
