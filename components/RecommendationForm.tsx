"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStopSearchStore } from "@/stores/StopSearchStore";
import { useRecommendationStore } from "@/stores/RecommendationStore";
import { RecommendationHighlights } from "@/lib/constants";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { createRecommendation } from "@/actions";

export default function RecommendationForm({
  initialRecommendation,
}: {
  initialRecommendation?: Recommendation;
}) {
  const { selectedStop, setSelectedStop } = useStopSearchStore();
  const { updateDraft, addDraft } = useRecommendationStore();

  const router = useRouter();

  const [recommendation, setRecommendation] = useState<Recommendation>(
    initialRecommendation
      ? { ...initialRecommendation, media: [] }
      : {
          id: uuidv4(),
          stop_name: selectedStop?.stop_name || "",
          stop_id: selectedStop?.stop_id || "",
          title: "",
          description: "",
          upvotesCount: 0,
          commentsCount: 0,
          category: selectedStop?.category || "",
          highlights: [],
          media: [],
          createdAt: DateTime.now().toISO(),
        }
  );

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
      file: file,
      url: URL.createObjectURL(file),
      recommendationId: recommendation.id,
      createdAt: DateTime.now().toISO(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(recommendation).forEach(([key, value]) => {
      if (key !== "media" && key !== "highlights") {
        formData.append(key, value as string);
      }
    });

    recommendation.media.forEach((file, index) => {
      formData.append(`media[${index}]`, file.file, file.file.name);
    });

    formData.append("highlights", recommendation.highlights.join(","));

    await createRecommendation(formData);

    console.log("Submitting recommendation:", recommendation);
    // setSelectedStop(null);
  };

  function handleCancel() {
    if (initialRecommendation) {
      updateDraft({ ...recommendation, createdAt: DateTime.now().toISO() });
    } else {
      addDraft({ ...recommendation, createdAt: DateTime.now().toISO() });
    }

    if (initialRecommendation) {
      router.replace("/recommendation/drafts");
    } else {
      router.replace("/");
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
          Save
        </Button>
        <Button type="submit">Post</Button>
      </div>
    </form>
  );
}
