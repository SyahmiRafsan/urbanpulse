"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import {
  CreateRecommendationState,
  RecommendationHighlights,
} from "@/lib/constants";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function RecommendationForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { selectedStop } = useStopSearchStore();
  const { updateDraft, addDraft, recommendationDrafts } =
    useRecommendationStore();

  const router = useRouter();
  const pathname = usePathname();

  const [recommendation, setRecommendation] = useState<Recommendation>({
    id: uuidv4(),
    stop_name: selectedStop?.stop_name || "",
    stop_id: selectedStop?.stop_id || "",
    title: "",
    upvotesCount: 0,
    commentsCount: 0,
    category: selectedStop?.category || "",
    highlights: [],
    media: [],
  });

  useEffect(() => {
    if (mode == CreateRecommendationState.SELECTED && selectedStop == null) {
      router.push(`${pathname}?mode=searching`);
    }
  }, [mode]);

  useEffect(() => {
    if (selectedStop) {
      setRecommendation((prev) => ({
        ...prev,
        stop_name: selectedStop.stop_name,
        stop_id: selectedStop.stop_id,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - recommendation.media.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newMedia = filesToAdd.map((file) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      recommendationId: recommendation.id,
      created_on: Date.now(),
    }));
    setRecommendation((prev) => ({
      ...prev,
      media: [...prev.media, ...newMedia].slice(0, 3),
    }));
  };

  const removeFile = (id: string) => {
    setRecommendation((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDraft(recommendation);
    // Here you would typically send the data to your backend
    console.log("Submitting recommendation:", recommendation);
  };

  function handleCancel() {
    const existingDraft = recommendationDrafts.find(
      (rc) => rc.id == recommendation.id
    );

    if (existingDraft) {
      updateDraft(recommendation);
    } else {
      addDraft(recommendation);
    }

    router.push("/");
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 border-b pb-6 px-4">
        <Label htmlFor="title" className="leading-6">
          Describe your recommendation to help make public transport
          improvements
        </Label>
        <Textarea
          placeholder="Title"
          id="title"
          name="title"
          required
          value={recommendation.title}
          onChange={handleInputChange}
          rows={1}
        />
        <Textarea
          placeholder="Enter a description..."
          id="description"
          name="description"
          required
          value={recommendation.description}
          onChange={handleInputChange}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {(recommendation.description &&
            recommendation.description.split("").length) ||
            0}
          /250 words
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
                recommendation.highlights.includes(hl)
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
            {recommendation.media.map((file) => (
              <div
                key={file.id}
                className="relative flex-shrink-0 animate-in slide-in-from-top-4 transition-all"
              >
                <img
                  src={file.url}
                  className="rounded-lg w-full h-[200px] shadow-sm"
                />
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => removeFile(file.id)}
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
      <div className="flex flex-col sm:flex-row justify-end gap-4 px-4">
        <Button
          variant={"outline"}
          type="button"
          onClick={() => handleCancel()}
        >
          Cancel
        </Button>
        <Button type="submit">Post</Button>
      </div>
    </form>
  );
}
